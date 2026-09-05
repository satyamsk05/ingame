class ApiClient {
  async getUserProfile() {
    try {
      const res = await fetch('/api/user/profile');
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  async joinGame(gameId, betType, entryFee) {
    try {
      const res = await fetch('/api/games/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, betType, entryFee })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  async claimWinnings({ score, prizeAmount, diceResult, gameTitle }) {
    try {
      const res = await fetch('/api/games/claim-winnings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, prizeAmount, diceResult, gameTitle })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  notifyParentWallet(balance) {
    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage({ type: 'WALLET_UPDATED', balance }, '*');
    }
  }
}

export const apiClient = new ApiClient();
