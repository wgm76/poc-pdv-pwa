export async function loadWasm() {
    const response = await fetch("/src/wasm/optimized.wasm"); 
    const bytes = await response.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(bytes);
    
    return instance.exports;
  }
  