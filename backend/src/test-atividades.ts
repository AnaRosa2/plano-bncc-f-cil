import fetch from 'node-fetch';

async function postTo(url: string) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tema: 'Segurança na Internet', tipo: 'discursiva', anoSerie: '8º ano EF' })
    });

    const text = await res.text();
    console.log('POST', url, '=>', 'Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Erro no fetch para', url, err);
  }
}

async function test() {
  await postTo('http://localhost:3333/atividades/gerar');
  await postTo('http://127.0.0.1:3333/atividades/gerar');
  await postTo('http://localhost:3333/unidades');
}

test();
