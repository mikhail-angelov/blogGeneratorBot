include .env

register:
	curl -F "url=${LAMBDA_URL}" https://api.telegram.org/bot${MOD_BOT_TOKEN}/setWebhook

unregister:
	curl https://api.telegram.org/bot${MOD_BOT_TOKEN}/deleteWebhook

vercel:
	npm run build
	vercel

secrets:
	vercel secrets add blog_bot_token ${MOD_BOT_TOKEN}
	vercel secrets add blog_gh_token ${GH_TOKEN}
	vercel secrets add blog_gh_user ${GH_USER}
	vercel secrets add blog_gh_repo ${GH_REPO}
	vercel secrets add blog_gh_branch ${GH_BRANCH}

test: 
	GH_TOKEN=${GH_TOKEN} GH_USER=${GH_USER} GH_REPO=${GH_REPO} GH_BRANCH=${GH_BRANCH} npm test

run: 
	GH_TOKEN=${GH_TOKEN} GH_USER=${GH_USER} GH_REPO=${GH_REPO} GH_BRANCH=${GH_BRANCH}  npm run dev