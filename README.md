async function getAccessToken(destInfo) {
  if (!destInfo || !destInfo.destinationConfiguration)
    throw new Error('Destination info not found for ' + DEST_NAME);

  const { clientId, clientSecret, tokenServiceURL } = destInfo.destinationConfiguration;
  const options = {
    method: 'POST',
    url: tokenServiceURL,
    form: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    },
    json: true,
    timeout: 10000
  };
  const resp = await request(options);
  return resp.access_token;
}