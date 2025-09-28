import React from 'react';

export const TestComponent = () => {
  console.log("TestComponent renderizado");
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '1rem' }}>
        🏥 FisioVem - Teste
      </h1>
      <p style={{ color: '#666', fontSize: '1.2rem', textAlign: 'center' }}>
        Se você está vendo esta mensagem, o React está funcionando!
      </p>
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#fff', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <p><strong>Status:</strong> Aplicação carregada com sucesso ✅</p>
        <p><strong>Data:</strong> {new Date().toLocaleString('pt-BR')}</p>
      </div>
    </div>
  );
};
