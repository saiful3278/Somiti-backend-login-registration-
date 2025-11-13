# Netlify Push Instructions and Account Emails

## Account Emails
- Netlify: mdm439382@gmail.com
- Supabase: mdm439382@gmail.com

## Push to Netlify (via Git)
- Ensure the Netlify site is connected to your repository and the `main` branch
- Commands:
  - `git add .`
  - `git commit -m "Deploy"`
  - `git branch -M main`
  - `git remote add origin <your-repo-url>`
  - `git push -u origin main`
  - Netlify will auto-deploy on push
