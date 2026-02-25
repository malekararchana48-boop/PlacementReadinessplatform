/**
 * KODNEST PREMIUM BUILD SYSTEM
 * JavaScript for interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeCopyPrompt();
    initializeChecklist();
    initializeActionButtons();
    initializeInputs();
});

/**
 * Copy Prompt functionality
 */
function initializeCopyPrompt() {
    const copyBtn = document.getElementById('copy-prompt');
    if (!copyBtn) return;
    
    copyBtn.addEventListener('click', async function() {
        const promptCode = document.querySelector('.prompt-code');
        if (!promptCode) return;
        
        const text = promptCode.textContent;
        
        try {
            await navigator.clipboard.writeText(text);
            showFeedback(copyBtn, 'Copied!', 'success');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                showFeedback(copyBtn, 'Copied!', 'success');
            } catch (err) {
                showFeedback(copyBtn, 'Failed to copy', 'error');
            }
            
            document.body.removeChild(textArea);
        }
    });
}

/**
 * Checklist functionality
 */
function initializeChecklist() {
    const checklistItems = document.querySelectorAll('.checklist-item');
    
    checklistItems.forEach(item => {
        // Click on checkbox or label toggles the checked state
        const checkbox = item.querySelector('.checkbox');
        const label = item.querySelector('.checklist-label');
        
        [checkbox, label].forEach(el => {
            if (el) {
                el.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleChecklistItem(item);
                });
            }
        });
        
        // Prevent checkbox toggle when clicking on input
        const input = item.querySelector('.proof-input');
        if (input) {
            input.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            
            input.addEventListener('change', function() {
                if (input.value.trim()) {
                    item.classList.add('checked');
                }
            });
        }
    });
}

function toggleChecklistItem(item) {
    const input = item.querySelector('.proof-input');
    const isChecked = item.classList.contains('checked');
    
    if (isChecked) {
        item.classList.remove('checked');
    } else {
        item.classList.add('checked');
        // Focus the input if it's empty
        if (input && !input.value.trim()) {
            setTimeout(() => input.focus(), 100);
        }
    }
    
    updateProgress();
}

function updateProgress() {
    const checklistItems = document.querySelectorAll('.checklist-item');
    const checkedItems = document.querySelectorAll('.checklist-item.checked');
    
    const total = checklistItems.length;
    const completed = checkedItems.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    // Update progress bar
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
    
    // Update progress text
    const progressStep = document.querySelector('.progress-step');
    if (progressStep) {
        progressStep.textContent = `Step ${Math.max(1, completed)} / ${total}`;
    }
    
    // Update status badge
    updateStatusBadge(completed, total);
}

function updateStatusBadge(completed, total) {
    const statusBadge = document.querySelector('.top-bar-right .status-badge');
    if (!statusBadge) return;
    
    // Remove all status classes
    statusBadge.classList.remove(
        'status-not-started',
        'status-in-progress',
        'status-success',
        'status-shipped'
    );
    
    if (completed === 0) {
        statusBadge.classList.add('status-not-started');
        statusBadge.textContent = 'Not Started';
    } else if (completed === total) {
        statusBadge.classList.add('status-shipped');
        statusBadge.textContent = 'Shipped';
    } else if (completed > 0) {
        statusBadge.classList.add('status-in-progress');
        statusBadge.textContent = 'In Progress';
    }
}

/**
 * Action Buttons functionality
 */
function initializeActionButtons() {
    const buildBtn = document.getElementById('build-lovable');
    const workedBtn = document.getElementById('it-worked');
    const errorBtn = document.getElementById('error-btn');
    const screenshotBtn = document.getElementById('add-screenshot');
    
    if (buildBtn) {
        buildBtn.addEventListener('click', function() {
            showFeedback(buildBtn, 'Opening Lovable...', 'info');
            // In a real implementation, this would open Lovable
            console.log('Build in Lovable clicked');
        });
    }
    
    if (workedBtn) {
        workedBtn.addEventListener('click', function() {
            showFeedback(workedBtn, 'Marked as working', 'success');
            // Mark first unchecked item as complete
            const uncheckedItems = document.querySelectorAll('.checklist-item:not(.checked)');
            if (uncheckedItems.length > 0) {
                uncheckedItems[0].classList.add('checked');
                updateProgress();
            }
        });
    }
    
    if (errorBtn) {
        errorBtn.addEventListener('click', function() {
            showFeedback(errorBtn, 'Error reported', 'error');
            // Show error state
            const statusBadge = document.querySelector('.top-bar-right .status-badge');
            if (statusBadge) {
                statusBadge.classList.remove('status-not-started', 'status-in-progress', 'status-success', 'status-shipped');
                statusBadge.classList.add('status-error');
                statusBadge.textContent = 'Error';
            }
        });
    }
    
    if (screenshotBtn) {
        screenshotBtn.addEventListener('click', function() {
            showFeedback(screenshotBtn, 'Screenshot added', 'success');
            // In a real implementation, this would open a file picker
            console.log('Add Screenshot clicked');
        });
    }
}

/**
 * Input field enhancements
 */
function initializeInputs() {
    const inputs = document.querySelectorAll('.input-field, .proof-input');
    
    inputs.forEach(input => {
        // Add subtle focus animation
        input.addEventListener('focus', function() {
            this.parentElement?.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement?.classList.remove('focused');
        });
        
        // Auto-resize textareas
        if (input.tagName === 'TEXTAREA') {
            input.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.max(80, this.scrollHeight) + 'px';
            });
        }
    });
}

/**
 * Show feedback on buttons
 */
function showFeedback(button, message, type) {
    const originalText = button.textContent;
    button.textContent = message;
    button.disabled = true;
    
    // Add temporary class based on type
    const originalClass = button.className;
    if (type === 'success') {
        button.style.backgroundColor = 'var(--color-success)';
        button.style.borderColor = 'var(--color-success)';
        button.style.color = 'white';
    } else if (type === 'error') {
        button.style.backgroundColor = 'var(--color-error)';
        button.style.borderColor = 'var(--color-error)';
        button.style.color = 'white';
    }
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.className = originalClass;
        button.style.backgroundColor = '';
        button.style.borderColor = '';
        button.style.color = '';
    }, 1500);
}

/**
 * Keyboard shortcuts
 */
document.addEventListener('keydown', function(e) {
    // Cmd/Ctrl + Enter to mark as worked
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        const workedBtn = document.getElementById('it-worked');
        if (workedBtn) {
            workedBtn.click();
        }
    }
    
    // Escape to clear any active feedback
    if (e.key === 'Escape') {
        const activeButtons = document.querySelectorAll('.btn[disabled]');
        activeButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.backgroundColor = '';
            btn.style.borderColor = '';
            btn.style.color = '';
        });
    }
});
