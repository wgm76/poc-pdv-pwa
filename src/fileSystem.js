let directoryHandle = null;


export const selectDirectory = async () => {
  try {
    directoryHandle = await window.showDirectoryPicker();
    localStorage.setItem("directoryHandle", await directoryHandle.requestPermission());
    alert("Pasta selecionada! Agora os arquivos podem ser salvos diretamente.");
  } catch (error) {
    console.error("Erro ao selecionar pasta:", error);
    alert("Erro ao selecionar pasta. Verifique as permissões.");
  }
};


export const loadDirectory = async () => {
  try {
    const savedHandle = localStorage.getItem("directoryHandle");
    if (savedHandle) {
      directoryHandle = await window.navigator.storage.getDirectory(savedHandle);
    }
  } catch (error) {
    console.error("Erro ao recuperar diretório salvo:", error);
  }
};


export const saveFile = async (fileName, content) => {
  try {
    if (!directoryHandle) {
      alert("Selecione uma pasta primeiro!");
      return;
    }

    const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();

    alert(`Arquivo "${fileName}" salvo com sucesso!`);
  } catch (error) {
    console.error("Erro ao salvar o arquivo:", error);
  }
};
