const axios = require('axios');

module.exports = async (req, res) => {
  const { code } = req.query;

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = 'https://your-serverless-function.com/auth/discord';

  try {
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Example role ID and server ID
    const guildId = '1237219812174987306';
    const requiredRoleId = '1237219812174987306';
    const memberResponse = await axios.get(`https://discord.com/api/v10/guilds/${guildId}/members/${userResponse.data.id}`, {
      headers: { Authorization: process.env.DISCORD_BOT_TOKEN }, // Use your bot's token
    });

    const userRoles = memberResponse.data.roles;
    const hasRequiredRole = userRoles.includes(requiredRoleId);

    if (hasRequiredRole) {
      res.redirect('https://your-github-pages-site.com/high-rank');
    } else {
      res.redirect('https://your-github-pages-site.com/home');
    }
  } catch (error) {
    console.error(error);
    res.redirect('https://your-github-pages-site.com/home');
  }
};
