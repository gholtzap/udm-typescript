#!/bin/bash

set -e

echo "🚀 Setting up UDM repository..."
echo ""

if [ -f .env ]; then
    echo "⚠️  .env file already exists. Skipping creation."
    echo ""
else
    echo "📝 Creating .env file..."
    echo ""

    read -p "Enter MongoDB URI: " MONGODB_URI
    read -p "Enter MongoDB Database Name (default: udm): " MONGODB_DB_NAME
    MONGODB_DB_NAME=${MONGODB_DB_NAME:-udm}
    read -p "Enter PORT (default: 8080): " PORT
    PORT=${PORT:-8080}

    cat > .env << EOF
PORT=${PORT}
MONGODB_URI=${MONGODB_URI}
MONGODB_DB_NAME=${MONGODB_DB_NAME}
EOF

    echo "✅ .env file created"
    echo ""
fi

echo "📦 Installing npm dependencies..."
npm install
echo ""

echo "🔨 Building TypeScript..."
npm run build
echo ""

echo "✅ Setup complete!"
echo ""
echo "To start the UDM server:"
echo "  Development: npm run dev"
echo "  Production:  npm start"
echo ""
echo "To run tests:"
echo "  npm test"
