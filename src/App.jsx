import { useEffect, useState } from "react";
import { selectDirectory, saveFile, loadDirectory } from "./fileSystem";

const App = () => {
  const [printerPort, setPrinterPort] = useState(null);
  const [scalePort, setScalePort] = useState(null);
  const [weight, setWeight] = useState("---");
  const [selectedPrinterPort, setSelectedPrinterPort] = useState("");
  const [selectedScalePort, setSelectedScalePort] = useState("");
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState("");

  useEffect(() => {
    // Registrando o Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        console.log("Service Worker registrado com sucesso!");
  
        // Espera o Service Worker ser ativado e pronto
        navigator.serviceWorker.ready.then(() => {
          // Aqui garantimos que o Service Worker está pronto
          if (navigator.serviceWorker.controller) {
            console.log("Service Worker agora controla esta página.");
          } else {
            console.log("Service Worker ainda não está controlando a página.");
          }
        });
      }).catch((error) => {
        console.error("Erro ao registrar o Service Worker:", error);
      });
    }

    // Registrar listener de nova versão
    if ('serviceWorker' in navigator) {
      console.log("Registrando listener para o Service Worker...");
      navigator.serviceWorker.addEventListener("message", (event) => {
        // Se o evento for uma nova versão, exibe a notificação
        if (event.data && event.data.type === "new-version") {
          console.log("Nova versão detectada:", event.data.version); // Log para debug
          setNewVersion(event.data.version);
          setNewVersionAvailable(true);
        }

        // Verifica se a nova versão foi ativada
        if (event.data && event.data.type === "new-version-activated") {
          console.log("A nova versão foi ativada!");
          setNewVersionAvailable(false); // Pode querer atualizar ou mostrar uma mensagem
        }
      });
    }

    // Carregar diretórios se necessário
    loadDirectory();
  }, []);
  

  // Função para forçar a atualização do Service Worker
  const updateServiceWorker = () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      // Envia mensagem para o Service Worker para "pular a espera" (skipWaiting)
      navigator.serviceWorker.controller.postMessage({ type: "skip-waiting" });

      // Atualiza a página para carregar a nova versão
      window.location.reload();
    }
  };

  const connectToPrinter = async () => {
    if (!selectedPrinterPort) {
      alert("Selecione uma porta serial para a impressora.");
      return;
    }

    try {
      const port = await navigator.serial.requestPort();
      await port.open({
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
        flowControl: "none"
      });
      setPrinterPort(port);
      alert(`Impressora conectada na porta ${selectedPrinterPort}`);
    } catch (error) {
      console.error("Erro ao conectar à impressora:", error);
      alert("Falha ao conectar à impressora.");
    }
  };

  const emitirLeituraX = async () => {
    if (!printerPort) {
      alert("Nenhuma impressora conectada.");
      return;
    }

    try {
      const writer = printerPort.writable.getWriter();
      const reader = printerPort.readable.getReader();
      const comandoLeituraX = new Uint8Array([0x01, 0x00, 0x14, 0x00, 0x02, 0x00, 0x30, 0x7C, 0xC2]);
      await writer.write(comandoLeituraX);
      let { value } = await reader.read();
      if (value[0] !== 0x06) {
        alert("Impressora não reconheceu o comando.");
        writer.releaseLock();
        reader.releaseLock();
        return;
      }
      await writer.write(new Uint8Array([0x05, 0x00]));
      ({ value } = await reader.read());
      console.log("Status recebido:", value);
      await writer.write(new Uint8Array([0x05, 0x00]));
      ({ value } = await reader.read());
      console.log("Resposta final:", value);
      writer.releaseLock();
      reader.releaseLock();
      alert("Leitura X enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao emitir Leitura X:", error);
      alert("Falha ao emitir Leitura X.");
    }
  };

  const connectToScale = async () => {
    if (!selectedScalePort) {
      alert("Selecione uma porta serial para a balança.");
      return;
    }

    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setScalePort(port);
      alert(`Balança conectada na porta ${selectedScalePort}`);
    } catch (error) {
      console.error("Erro ao conectar à balança:", error);
      alert("Falha ao conectar à balança.");
    }
  };

  const readWeight = async () => {
    if (!scalePort) {
      alert("Nenhuma balança conectada.");
      return;
    }

    try {
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = scalePort.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        if (value) {
          setWeight(value.trim());
        }
      }
    } catch (error) {
      console.error("Erro ao ler peso:", error);
      alert("Falha ao ler peso.");
    }
  };

  return (
    <div>
      <h1>Gravação de Arquivo no PWA</h1>
      <button onClick={selectDirectory}>Selecionar Pasta</button>
      <button onClick={() => saveFile("meuArquivo.txt", "Teste gravando arquivo no disco")}>
        Salvar Arquivo
      </button>
      <hr />

      {/* Exibindo a notificação de nova versão */}
      {newVersionAvailable && (
        <div style={{ background: "yellow", padding: "10px", marginBottom: "10px" }}>
          <p>Uma nova versão ({newVersion}) está disponível!</p>
          <button onClick={updateServiceWorker}>Atualizar Agora</button>
        </div>
      )}

      <h2>Impressora Térmica (Serial)</h2>
      <label>Selecionar Porta Impressora:</label>
      <select onChange={(e) => setSelectedPrinterPort(e.target.value)}>
        <option value="">--Selecione a Porta--</option>
        <option value="COM1">COM1</option>
        <option value="COM2">COM2</option>
        <option value="COM5">COM5</option>
      </select>
      <button onClick={connectToPrinter} disabled={!selectedPrinterPort}>
        Conectar Impressora
      </button>
      <button onClick={emitirLeituraX} disabled={!printerPort}>
        Emitir Leitura X
      </button>
      <hr />

      <h2>Balança (Porta Serial)</h2>
      <label>Selecionar Porta Balança:</label>
      <select onChange={(e) => setSelectedScalePort(e.target.value)}>
        <option value="">--Selecione a Porta--</option>
        <option value="COM1">COM1</option>
        <option value="COM2">COM2</option>
        <option value="COM3">COM3</option>
      </select>
      <button onClick={connectToScale} disabled={!selectedScalePort}>
        Conectar Balança
      </button>
      <button onClick={readWeight} disabled={!scalePort}>
        Ler Peso
      </button>
      <p>Peso: {weight}</p>
    </div>
  );
};

export default App;
