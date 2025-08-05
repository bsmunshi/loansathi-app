import React from 'react';
import { Github, Mail, Code, Zap, Brain, Coffee, Heart, User } from 'lucide-react';

const AboutMe = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              BM
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Bhushan Munshi
            </h1>
            <p className="text-xl text-primary-600 mb-4">
              AI-Powered Developer & Financial Technology Enthusiast
            </p>
            <p className="text-gray-600 leading-relaxed">
              Passionate about leveraging artificial intelligence to build practical solutions 
              that make financial planning accessible to everyone. Creator of LoanSathi - 
              India's smart loan calculator.
            </p>
            
            {/* Social Links */}
            <div className="flex justify-center md:justify-start gap-4 mt-6">
              <a 
                href="https://github.com/bsmunshi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <Github size={18} />
                GitHub
              </a>
              <a 
                href="mailto:bhushan.munshi@gmail.com" 
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Mail size={18} />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* About LoanSathi */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Heart className="text-red-500" />
          About LoanSathi
        </h2>
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="mb-4">
            LoanSathi was born from a simple observation: most loan calculators in India 
            are either too complex or too basic. As someone who understands both technology 
            and finance, I wanted to create something that bridges this gap.
          </p>
          <p className="mb-4">
            This application helps Indian borrowers make informed decisions about:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li><strong>EMI Calculations</strong> - Clear, accurate monthly payment estimates</li>
            <li><strong>Borrowing Capacity</strong> - Know your limits based on FOIR guidelines</li>
            <li><strong>Prepayment Benefits</strong> - Understand the impact of extra payments</li>
            <li><strong>Secure Authentication</strong> - Your data stays private and protected</li>
          </ul>
          <p>
            Every feature is designed with the Indian financial ecosystem in mind, 
            from FOIR compliance to rupee formatting.
          </p>
        </div>
      </div>

      {/* AI-Powered Development Story */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Brain className="text-purple-600" />
          Built with AI & Vibe Coding
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Zap className="text-yellow-500" size={20} />
              The AI Development Process
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>
                This entire application was built using <strong>AI-assisted development</strong> 
                with Amazon Q Developer. Here's how the magic happened:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Started with a simple idea: "Build a loan calculator for India"</li>
                <li>Used conversational AI to design the architecture</li>
                <li>Generated React components through natural language</li>
                <li>Implemented complex financial calculations via AI prompts</li>
                <li>Added authentication system with AI guidance</li>
                <li>Deployed to production with AI-generated scripts</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Code className="text-blue-500" size={20} />
              Vibe Coding Philosophy
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>
                "Vibe coding" is about flowing with the creative process, 
                letting AI handle the heavy lifting while focusing on the vision:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Think in problems, not syntax</li>
                <li>Describe what you want, let AI write the code</li>
                <li>Iterate quickly with conversational feedback</li>
                <li>Focus on user experience over technical complexity</li>
                <li>Build, test, and deploy in hours, not weeks</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Development Timeline */}
        <div className="mt-8 p-6 bg-white rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Coffee className="text-brown-500" size={20} />
            Development Timeline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-800">Hour 1</div>
              <div className="text-blue-600">Concept & Planning</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-semibold text-green-800">Hours 2-4</div>
              <div className="text-green-600">Core Calculators</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-800">Hours 5-6</div>
              <div className="text-purple-600">Authentication</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="font-semibold text-orange-800">Hour 7</div>
              <div className="text-orange-600">Deployment</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Technology Stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'React 18', desc: 'Frontend Framework' },
            { name: 'Vite', desc: 'Build Tool' },
            { name: 'Tailwind CSS', desc: 'Styling' },
            { name: 'Recharts', desc: 'Data Visualization' },
            { name: 'Vercel', desc: 'Hosting Platform' },
            { name: 'GitHub', desc: 'Version Control' },
            { name: 'Amazon Q', desc: 'AI Development' },
            { name: 'OAuth 2.0', desc: 'Authentication' }
          ].map((tech, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-800">{tech.name}</div>
              <div className="text-sm text-gray-600">{tech.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vision & Future */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Vision & Future
        </h2>
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="mb-4">
            LoanSathi is just the beginning. My vision is to democratize financial 
            technology in India by making complex calculations simple and accessible.
          </p>
          <p className="mb-4">
            <strong>What's Next:</strong>
          </p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Advanced loan comparison features</li>
            <li>Integration with Indian banks and NBFCs</li>
            <li>Personalized financial recommendations</li>
            <li>Multi-language support for regional languages</li>
            <li>Mobile app for iOS and Android</li>
          </ul>
          <p>
            The future of development is collaborative - humans providing vision 
            and creativity, AI handling implementation. LoanSathi proves that 
            powerful applications can be built quickly when you combine domain 
            knowledge with AI assistance.
          </p>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-primary-600 text-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Let's Connect!</h2>
        <p className="text-primary-100 mb-6">
          Interested in AI-powered development, fintech, or just want to chat about 
          building cool stuff? I'd love to hear from you!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="https://github.com/bsmunshi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View My GitHub
          </a>
          <a 
            href="mailto:bhushan.munshi@gmail.com" 
            className="px-6 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors"
          >
            Send an Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
