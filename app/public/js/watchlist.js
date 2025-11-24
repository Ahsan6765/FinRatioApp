document.addEventListener('DOMContentLoaded', () => {
    const stockSymbolInput = document.getElementById('stockSymbolInput');
    const addStockBtn = document.getElementById('addStockBtn');
    const watchlistGrid = document.getElementById('watchlistGrid');
    const emptyWatchlistMsg = document.getElementById('emptyWatchlistMsg');

    let watchlist = JSON.parse(localStorage.getItem('finlyzer_watchlist')) || [];

    function saveWatchlist() {
        localStorage.setItem('finlyzer_watchlist', JSON.stringify(watchlist));
    }

    function renderWatchlist() {
        watchlistGrid.innerHTML = '';

        if (watchlist.length === 0) {
            watchlistGrid.appendChild(emptyWatchlistMsg);
            emptyWatchlistMsg.style.display = 'block';
            return;
        } else {
            emptyWatchlistMsg.style.display = 'none';
        }

        watchlist.forEach(symbol => {
            const card = document.createElement('div');
            card.className = 'card watchlist-card';
            card.innerHTML = `
        <div class="card-header">
          <h3>${symbol}</h3>
          <button class="remove-btn" data-symbol="${symbol}">×</button>
        </div>
        <div class="card-body" id="data-${symbol}">
          <p>Loading data...</p>
        </div>
        <div class="card-actions">
          <a href="/api/stock/${symbol}/technical" class="btn-small">Technical API</a>
        </div>
      `;
            watchlistGrid.appendChild(card);

            // Fetch data for the stock (using technical API for now as a proxy for validity/data)
            // In a real app, we'd have a specific quote endpoint.
            fetchData(symbol);
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const symbolToRemove = e.target.getAttribute('data-symbol');
                watchlist = watchlist.filter(s => s !== symbolToRemove);
                saveWatchlist();
                renderWatchlist();
            });
        });
    }

    async function fetchData(symbol) {
        const dataContainer = document.getElementById(`data-${symbol}`);
        try {
            // We'll use the technical endpoint to get the latest price (close of last day)
            // This is a bit of a hack since we don't have a dedicated quote endpoint yet.
            const response = await fetch(`/api/stock/${symbol}/technical?timeframe=1W`);
            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();
            if (data && data.length > 0) {
                const latest = data[data.length - 1];
                const prev = data[data.length - 2];
                const change = latest.close - prev.close;
                const changePct = (change / prev.close) * 100;
                const colorClass = change >= 0 ? 'positive-text' : 'negative-text';

                dataContainer.innerHTML = `
          <p class="price">Price: ${latest.close.toFixed(2)}</p>
          <p class="change ${colorClass}">
            ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePct.toFixed(2)}%)
          </p>
          <p class="date">Date: ${latest.date}</p>
        `;
            } else {
                dataContainer.innerHTML = '<p>No data available</p>';
            }
        } catch (error) {
            console.error(error);
            dataContainer.innerHTML = '<p class="error">Error loading data</p>';
        }
    }

    addStockBtn.addEventListener('click', () => {
        const symbol = stockSymbolInput.value.trim().toUpperCase();
        if (symbol && !watchlist.includes(symbol)) {
            watchlist.push(symbol);
            saveWatchlist();
            renderWatchlist();
            stockSymbolInput.value = '';
        } else if (watchlist.includes(symbol)) {
            alert('Stock already in watchlist');
        }
    });

    stockSymbolInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addStockBtn.click();
        }
    });

    renderWatchlist();
});
