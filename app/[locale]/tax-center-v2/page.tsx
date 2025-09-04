export default function TaxCenterV2() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Tax Center V2 (PJ)</h1>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Resumo • DAS/ISS • Fator R • Obrigações</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
          <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>DAS (venc. 20)</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>R$ 312</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
          <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>ISS (cidade)</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>R$ 128</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
          <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>Pendências</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>0</p>
          <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>Sem multas</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
          <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>Economia mês</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>R$ 180</p>
        </div>
      </div>
    </div>
  );
}
