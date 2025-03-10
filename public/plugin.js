// Feedback Button Embed Code v2.0
(function() {
    // Config    
        const config = {
        formUrl: 'http://www.form.in/feedback',
        btnColor: '#2563eb',
        btnPosition: '40px',
        btnSize: '56px',
        zIndex: 9999
    };

    // Dynamically injecting styles
    const style = document.createElement('style');
    style.textContent = `
    .feedback-fab {
        position: fixed;
        bottom: ${config.btnPosition};
        right: ${config.btnPosition};
        width: ${config.btnSize};
        height: ${config.btnSize};
        border-radius: 9999px;
        background: ${config.btnColor};
        color: white;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: ${config.zIndex};
        border: none;
        outline: none;
    }
    .feedback-fab:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 32px rgba(0,0,0,0.2);
    }
    .feedback-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.4);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: ${config.zIndex + 1};
        backdrop-filter: blur(4px);
    }
    .modal-container {
        width: min(90%, 640px);
        height: 70vh;
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 20px;
    }
    .modal-container.active {
        transform: translateY(0);
        opacity: 1;
    }
    .modal-iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
    .close-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 40px;
        height: 40px;
        background: rgba(255,255,255,0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
    }
    .close-btn:hover {
        background: #f3f4f6;
        transform: rotate(90deg);
    }
    `;
    document.head.appendChild(style);

    // Create a floating action button
    const fab = document.createElement('button');
    fab.className = 'feedback-fab';
    fab.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
    `;
    
    // Create a modal
    const modal = document.createElement('div');
    modal.className = 'feedback-modal';
    modal.innerHTML = `
        <div class="modal-container">
            <iframe class="modal-iframe" src="${config.formUrl}"></iframe>
            <button class="close-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
        </div>
    `;

    document.body.append(fab, modal);

    // Interaction Logic
    fab.addEventListener('click', () => {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.querySelector('.modal-container').classList.add('active');
        }, 10);
    });

    modal.querySelector('.close-btn').addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // ESC close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    function closeModal() {
        modal.querySelector('.modal-container').classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
})();
