export async function APICall(apiUrl: any, methodType: any, inputParam?: any) {
  try {
    
    let response = await fetch(apiUrl, {
      method: methodType,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(inputParam),
    });
    
    return await response.json();
  } catch (error) {
    
    return JSON.stringify(error);
  }
}
