const API_BASE = '/api';

export async function fetchAlerts() {
  try {
    const response = await fetch(`${API_BASE}/sos`);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
}

export async function createAlert(alertData) {
  try {
    const response = await fetch(`${API_BASE}/sos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertData),
    });
    if (!response.ok) throw new Error('Failed to create alert');
    return await response.json();
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
}

export async function updateAlertStatus(alertId, status) {
  // For demo purposes, this is mocked since backend doesn't have PATCH endpoint
  console.log(`Updating alert ${alertId} to status: ${status}`);
  return { success: true, status };
}
