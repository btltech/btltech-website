#!/bin/bash

# BTLTech Website - Git Remote Setup Script
# Run this after creating your GitHub repository

echo "🚀 Setting up Git remote for BTLTech website..."

# Replace 'YOUR_USERNAME' with your actual GitHub username
# Replace 'REPOSITORY_NAME' with your repository name (e.g., 'btltech-website')

echo "Please provide your GitHub details:"
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your repository name: " REPOSITORY_NAME

# Add remote origin
git remote add origin https://github.com/$GITHUB_USERNAME/$REPOSITORY_NAME.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main

echo "✅ Repository successfully pushed to GitHub!"
echo "🌐 Your website is now available at: https://github.com/$GITHUB_USERNAME/$REPOSITORY_NAME"
echo ""
echo "📋 Next steps:"
echo "1. Set up GitHub Pages for free hosting"
echo "2. Configure custom domain (btltech.co.uk)"
echo "3. Set up automatic deployments"
