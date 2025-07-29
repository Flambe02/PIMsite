import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CGU - Condições Gerais de Uso | PIM',
  description: 'Condições Gerais de Uso do Site PIM - The Pimentão Rouge Company Ltda',
};

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Condições Gerais de Uso do Site PIM
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Artigo 1: Objeto</h2>
              <p className="text-gray-700 mb-4">
                Estas Condições Gerais de Uso ("CGU") regulam o uso dos serviços oferecidos pelo site PIM ("Site"), 
                operado pela The Pimentão Rouge Company Ltda.
              </p>
              <p className="text-gray-700 mb-4">
                O acesso e uso dos serviços implica aceitação total destas CGU.
              </p>
              <p className="text-gray-700">
                O usuário declara ter lido e aceito integralmente as regras aqui estabelecidas.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Artigo 2: Acesso ao Site e aos Serviços / Disponibilidade</h2>
              <p className="text-gray-700 mb-4">O Site oferece gratuitamente os seguintes serviços:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Verificação e análise automática de holerite/contracheque digitalizado</li>
                <li>Estimativas e simulações salariais</li>
                <li>Outros serviços gratuitos de orientação para trabalhadores brasileiros</li>
              </ul>
              <p className="text-gray-700 mb-4">
                O acesso ao Site é livre e pode ser suspenso a qualquer momento para manutenção, atualização ou por decisão da The Pimentão Rouge Company Ltda.
              </p>
              <p className="text-gray-700 mb-4">
                O usuário é responsável por garantir que seu equipamento (computador, celular, internet) atende aos requisitos mínimos para navegação.
              </p>
              <p className="text-gray-700">
                Não garantimos disponibilidade ininterrupta do Site.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Artigo 3: Dados Pessoais e Uso das Informações</h2>
              <p className="text-gray-700 mb-4">O Site coleta e utiliza dados pessoais para:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Prestar serviços de análise/verificação de holerite</li>
                <li>Gerenciar solicitações de suporte e atendimento</li>
                <li>Melhorar a experiência do usuário e os algoritmos de análise</li>
                <li>Enviar informações e comunicações promocionais (caso autorizado)</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Os dados são tratados conforme a LGPD (Lei Geral de Proteção de Dados – Lei 13.709/2018).
              </p>
              <p className="text-gray-700">
                O usuário pode, a qualquer momento, solicitar acesso, correção ou exclusão de seus dados por meio do contato: <a href="mailto:Admin@pimsite.com" className="text-blue-600 hover:underline">Admin@pimsite.com</a>.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Artigo 4: Modificação do Site</h2>
              <p className="text-gray-700">
                A The Pimentão Rouge Company Ltda reserva-se o direito de modificar, atualizar ou remover, a qualquer momento e sem aviso prévio, qualquer parte do Site e dos Serviços oferecidos.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Artigo 5: Coleta e Armazenamento de Dados</h2>
              <p className="text-gray-700 mb-4">
                A coleta dos dados pessoais ocorre somente para execução dos serviços propostos.
              </p>
              <p className="text-gray-700 mb-4">
                As informações são armazenadas de forma segura e apenas pelo tempo necessário.
              </p>
              <p className="text-gray-700">
                O usuário não é obrigado a fornecer dados pessoais, mas isso pode impedir o acesso a determinados serviços.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Artigo 6: Uso dos Serviços de Verificação de Holerite</h2>
              <p className="text-gray-700 mb-4">
                O usuário é totalmente responsável pelas informações enviadas ao Site.
              </p>
              <p className="text-gray-700 mb-4">
                O serviço de verificação é automático e depende da qualidade e legibilidade do documento enviado.
              </p>
              <p className="text-gray-700 mb-4">
                Não garantimos a análise de holerites com formatação fora dos padrões, incompletos ou ilegíveis.
              </p>
              <p className="text-gray-700 mb-4">O serviço não atende:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Funcionários públicos ou empresas do setor público</li>
                <li>Documentos de fora do Brasil</li>
                <li>Holerites de empresas com formatos não reconhecidos pelo sistema</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Artigo 7: Segurança e Obrigações do Usuário</h2>
              <p className="text-gray-700 mb-4">O usuário compromete-se a:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Utilizar o Site de forma lícita, responsável e ética</li>
                <li>Não inserir dados de terceiros sem consentimento</li>
                <li>Não enviar conteúdos ofensivos, ilegais ou protegidos por direitos autorais sem autorização</li>
                <li>Proteger seus próprios dispositivos contra vírus e ataques</li>
              </ul>
              <p className="text-gray-700">
                A violação destas regras pode levar à suspensão do acesso e a sanções legais.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Artigo 8: Propriedade Intelectual</h2>
              <p className="text-gray-700 mb-4">
                Todo o conteúdo do Site (textos, algoritmos, imagens, logotipos, design) é protegido por direitos autorais e pertence à The Pimentão Rouge Company Ltda ou a parceiros autorizados.
              </p>
              <p className="text-gray-700">
                É proibida a reprodução, distribuição ou modificação sem autorização prévia.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Artigo 9: Links Externos</h2>
              <p className="text-gray-700 mb-4">
                O Site pode conter links para outros sites de terceiros.
              </p>
              <p className="text-gray-700">
                A The Pimentão Rouge Company Ltda não se responsabiliza pelo conteúdo, funcionamento ou segurança desses sites externos.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Artigo 10: Limitação de Responsabilidade</h2>
              <p className="text-gray-700 mb-4">
                O Site e os Serviços são oferecidos "no estado em que se encontram", sem garantias de qualquer espécie.
              </p>
              <p className="text-gray-700">
                A The Pimentão Rouge Company Ltda não se responsabiliza por danos indiretos, falhas de serviço, erros de análise ou uso inadequado dos resultados pelo usuário.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Artigo 11: Publicidade</h2>
              <p className="text-gray-700">
                A The Pimentão Rouge Company Ltda pode exibir mensagens publicitárias no Site, a seu critério.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Artigo 12: Foro e Lei Aplicável</h2>
              <p className="text-gray-700 mb-4">
                Este termo é regido pela legislação brasileira.
              </p>
              <p className="text-gray-700">
                Em caso de litígio, fica eleito o foro da comarca de São Paulo / Brasil, com renúncia a qualquer outro.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Data da última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Contato:</strong> <a href="mailto:Admin@pimsite.com" className="text-blue-600 hover:underline">Admin@pimsite.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 