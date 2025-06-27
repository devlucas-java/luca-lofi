import React, { useState } from "react";

export const VideoTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testUrls = [
    "https://f003.backblazeb2.com/file/la-chica/bg-1.mp4",
    "https://f003.backblazeb2.com/file/la-chica/mb1.mp4", 
    "https://f003.backblazeb2.com/file/la-chica/static1.mp4",
    "https://f003.backblazeb2.com/file/la-chica/static1.mp3"
  ];

  const testVideo = async (url: string) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        addResult(`✅ SUCCESS: ${url} - Duration: ${video.duration}s`);
        resolve(true);
      };
      
      video.onerror = (e) => {
        addResult(`❌ ERROR: ${url} - ${video.error?.message || 'Unknown error'}`);
        resolve(false);
      };
      
      video.ontimeout = () => {
        addResult(`⏰ TIMEOUT: ${url}`);
        resolve(false);
      };
      
      setTimeout(() => {
        if (video.readyState === 0) {
          addResult(`⏰ TIMEOUT: ${url} - No response after 10s`);
          resolve(false);
        }
      }, 10000);
      
      video.src = url;
    });
  };

  const testAudio = async (url: string) => {
    return new Promise((resolve) => {
      const audio = document.createElement('audio');
      audio.crossOrigin = 'anonymous';
      audio.preload = 'metadata';
      
      audio.onloadedmetadata = () => {
        addResult(`✅ SUCCESS: ${url} - Duration: ${audio.duration}s`);
        resolve(true);
      };
      
      audio.onerror = (e) => {
        addResult(`❌ ERROR: ${url} - ${audio.error?.message || 'Unknown error'}`);
        resolve(false);
      };
      
      setTimeout(() => {
        if (audio.readyState === 0) {
          addResult(`⏰ TIMEOUT: ${url} - No response after 10s`);
          resolve(false);
        }
      }, 10000);
      
      audio.src = url;
    });
  };

  const testFetch = async (url: string) => {
    try {
      addResult(`🔍 FETCH TEST: ${url}`);
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'cors'
      });
      
      addResult(`📊 FETCH RESPONSE: ${url} - Status: ${response.status}`);
      addResult(`📋 HEADERS: Content-Type: ${response.headers.get('Content-Type')}, Content-Length: ${response.headers.get('Content-Length')}`);
      
      return response.ok;
    } catch (error) {
      addResult(`❌ FETCH ERROR: ${url} - ${error}`);
      return false;
    }
  };

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    addResult("🧪 Iniciando testes de diagnóstico...");
    
    for (const url of testUrls) {
      addResult(`\n--- Testando: ${url} ---`);
      
      // Test fetch first
      await testFetch(url);
      
      // Test media loading
      if (url.includes('.mp4')) {
        await testVideo(url);
      } else if (url.includes('.mp3')) {
        await testAudio(url);
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    addResult("\n🏁 Testes concluídos!");
    setIsLoading(false);
  };

  return (
    <div className="p-6 bg-black text-green-400 font-mono min-h-screen">
      <h1 className="text-2xl mb-4">🔧 Diagnóstico Backblaze B2</h1>
      
      <button
        onClick={runTests}
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700 text-black font-bold py-2 px-4 rounded mb-4 disabled:opacity-50"
      >
        {isLoading ? "⏳ Testando..." : "🚀 Executar Testes"}
      </button>

      <div className="bg-gray-900 p-4 rounded-lg max-h-96 overflow-y-auto">
        <h2 className="text-lg mb-2">📋 Resultados:</h2>
        {testResults.length === 0 ? (
          <p className="text-gray-400">Clique em "Executar Testes" para começar...</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm whitespace-pre-wrap">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-400">
        <h3 className="text-lg text-green-400 mb-2">🎯 O que este teste verifica:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>✅ Se as URLs estão acessíveis (HTTP HEAD request)</li>
          <li>🎬 Se os vídeos podem ser carregados pelo navegador</li>
          <li>🔊 Se os áudios podem ser carregados pelo navegador</li>
          <li>📡 Se há problemas de CORS</li>
          <li>⏱️ Se há timeouts de conexão</li>
        </ul>
        
        <div className="mt-4 p-3 bg-yellow-900 text-yellow-200 rounded">
          <h4 className="font-bold">⚠️ Possíveis problemas:</h4>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Bucket não configurado como público</li>
            <li>CORS não configurado no bucket</li>
            <li>URLs incorretas ou arquivos não existem</li>
            <li>Firewall bloqueando Backblaze B2</li>
          </ul>
        </div>
      </div>
    </div>
  );
};