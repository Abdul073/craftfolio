export async function GET(request : any) {
    const host = request.headers.get('host') || 'No host';
    const url = request.url || 'No URL';
    const referer = request.headers.get('referer') || 'No referer';
    
    console.log('Debug API request received:');
    console.log('- Host:', host);
    console.log('- URL:', url);
    console.log('- Headers:', Object.fromEntries([...request.headers]));
  
    return new Response(JSON.stringify({
      host,
      url,
      referer,
      headers: Object.fromEntries([...request.headers]),
      message: 'Debug info logged to console'
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  