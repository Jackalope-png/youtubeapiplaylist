export async function GET(req) {
  const API_KEY = "";
  const PLAYLIST_ID = "";
  let allItems = [];
  let nextPageToken = null;

  try {
    do {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${API_KEY}` + (nextPageToken ? `&pageToken=${nextPageToken}` : '');

      const response = await fetch(url);
      if (!response.ok) {
        const responseBody = await response.text();
        console.error("Response Body:", responseBody);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // Filter out invalid items
      const validItems = data.items.filter(item => item && item.snippet && item.snippet.title);
      allItems = allItems.concat(validItems);
      nextPageToken = data.nextPageToken;
      
    } while (nextPageToken);

    return new Response(JSON.stringify(allItems), { status: 200 });
  } catch (error) {
    console.error("Error fetching playlist: ", error);
    return new Response(JSON.stringify({ error: "Failed to fetch playlist" }), {
      status: 500,
    });
  }
}
