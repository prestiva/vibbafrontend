import ChatbotWidget from './components/ChatbotWidget'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-50 to-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">Welcome to Vibba AI</h1>
      <p className="text-xl text-center mb-8 max-w-2xl text-gray-600">
        Experience our sleek and intuitive AI assistant. Click the chat icon in the bottom right corner to start your conversation with Vibba AI!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Key Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Sleek, modern design</li>
            <li>Responsive layout</li>
            <li>Intelligent AI responses</li>
            <li>Easy-to-use interface</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-primary">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click the chat icon</li>
            <li>Type your message</li>
            <li>Press send or hit enter</li>
            <li>Receive instant responses</li>
          </ol>
        </div>
      </div>
      <ChatbotWidget />
    </main>
  )
}

