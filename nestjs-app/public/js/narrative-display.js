/**
 * Narrative Display - Enhanced text rendering and effects for story content
 */

class NarrativeDisplay {
    constructor(terminalInterface) {
        this.terminal = terminalInterface;
        this.typewriterSpeed = 30; // milliseconds per character
        this.isTyping = false;
    }

    // Display text with typewriter effect
    async typewriterText(text, element, speed = this.typewriterSpeed) {
        if (this.isTyping) return;
        
        this.isTyping = true;
        element.innerHTML = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                
                // Auto-scroll terminal
                if (this.terminal && this.terminal.elements.terminalDisplay) {
                    this.terminal.elements.terminalDisplay.scrollTop = 
                        this.terminal.elements.terminalDisplay.scrollHeight;
                }
            } else {
                clearInterval(typeInterval);
                this.isTyping = false;
            }
        }, speed);
    }

    // Display room description with atmospheric effects
    displayAtmosphericDescription(description, atmosphere = 'neutral') {
        const narrativeSection = this.terminal.elements.narrativeSection;
        
        // Apply atmosphere-based styling
        const atmosphereClasses = {
            'mysterious': 'atmosphere-mysterious',
            'dark': 'atmosphere-dark', 
            'bright': 'atmosphere-bright',
            'magical': 'atmosphere-magical',
            'dangerous': 'atmosphere-dangerous',
            'peaceful': 'atmosphere-peaceful',
            'neutral': 'atmosphere-neutral'
        };

        const descriptionElement = document.createElement('div');
        descriptionElement.className = `room-description glow-text ${atmosphereClasses[atmosphere] || 'atmosphere-neutral'}`;
        
        narrativeSection.innerHTML = '';
        narrativeSection.appendChild(descriptionElement);
        
        // Use typewriter effect for immersion
        this.typewriterText(description, descriptionElement);
    }

    // Display dialogue with character-specific styling
    displayCharacterDialogue(npcName, text, npcType = 'friendly', choices = null) {
        const npcDialogue = this.terminal.elements.npcDialogue;
        
        const dialogueClasses = {
            'friendly': 'npc-friendly',
            'hostile': 'npc-hostile',
            'mysterious': 'npc-mysterious',
            'merchant': 'npc-merchant',
            'guard': 'npc-guard',
            'spirit': 'npc-spirit'
        };

        const dialogueHtml = `
            <div class="npc-name ${dialogueClasses[npcType] || 'npc-friendly'}">${npcName}:</div>
            <div class="npc-speech">"${text}"</div>
            ${choices ? this.formatDialogueChoices(choices) : ''}
        `;

        npcDialogue.innerHTML = dialogueHtml;
        npcDialogue.style.display = 'block';

        // Add subtle animation
        npcDialogue.style.opacity = '0';
        npcDialogue.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            npcDialogue.style.transition = 'all 0.3s ease';
            npcDialogue.style.opacity = '1';
            npcDialogue.style.transform = 'translateY(0)';
        }, 50);
    }

    // Format dialogue choices with hover effects
    formatDialogueChoices(choices) {
        return `
            <div class="dialogue-choices">
                ${choices.map((choice, index) => 
                    `<div class="dialogue-choice" data-choice="${index}" onclick="window.terminal.selectDialogueChoice(${index})">${index + 1}. ${choice}</div>`
                ).join('')}
            </div>
        `;
    }

    // Display action results with appropriate visual feedback
    displayActionResult(result, type = 'neutral') {
        const actionFeedback = this.terminal.elements.actionFeedback;
        
        const feedbackClasses = {
            'success': 'action-success',
            'failure': 'action-failure',
            'info': 'action-info',
            'warning': 'action-warning',
            'magical': 'action-magical',
            'combat': 'action-combat',
            'neutral': 'action-neutral'
        };

        const feedbackElement = document.createElement('div');
        feedbackElement.className = `action-result ${feedbackClasses[type] || 'action-neutral'}`;
        feedbackElement.textContent = result;

        // Clear previous feedback and add new
        actionFeedback.innerHTML = '';
        actionFeedback.appendChild(feedbackElement);

        // Fade in effect
        feedbackElement.style.opacity = '0';
        setTimeout(() => {
            feedbackElement.style.transition = 'opacity 0.3s ease';
            feedbackElement.style.opacity = '1';
        }, 50);

        // Auto-hide after delay for non-critical messages
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                feedbackElement.style.transition = 'opacity 1s ease';
                feedbackElement.style.opacity = '0';
                setTimeout(() => {
                    if (feedbackElement.parentNode) {
                        feedbackElement.parentNode.removeChild(feedbackElement);
                    }
                }, 1000);
            }, 4000);
        }
    }

    // Display environmental events with special effects
    displayEnvironmentalEvent(event) {
        const commandHistory = this.terminal.elements.commandHistory;
        
        const eventTypes = {
            'sound': { class: 'env-sound', prefix: '♪' },
            'visual': { class: 'env-visual', prefix: '✦' },
            'weather': { class: 'env-weather', prefix: '☁' },
            'magic': { class: 'env-magic', prefix: '✧' },
            'danger': { class: 'env-danger', prefix: '⚠' },
            'discovery': { class: 'env-discovery', prefix: '!' }
        };

        const eventData = eventTypes[event.type] || eventTypes['visual'];
        
        const eventElement = document.createElement('div');
        eventElement.className = `environmental-event ${eventData.class} glow-text`;
        eventElement.innerHTML = `<span class="event-prefix">${eventData.prefix}</span> ${event.description}`;
        
        commandHistory.appendChild(eventElement);
        
        // Special pulsing effect for important events
        if (event.important) {
            eventElement.classList.add('pulse-effect');
        }

        // Auto-scroll to show new event
        this.terminal.elements.terminalDisplay.scrollTop = 
            this.terminal.elements.terminalDisplay.scrollHeight;
    }

    // Display inventory with enhanced item details
    displayEnhancedInventory(items) {
        const inventoryContent = this.terminal.elements.inventoryPanel.querySelector('.panel-content');
        
        if (items.length === 0) {
            inventoryContent.innerHTML = '<div class="empty-message">No items carried</div>';
            return;
        }

        const itemsHtml = items.map(item => {
            const rarityClass = item.rarity ? `rarity-${item.rarity}` : '';
            const condition = item.condition || 'good';
            const conditionClass = `condition-${condition}`;
            
            return `
                <div class="inventory-item enhanced ${rarityClass}">
                    <div class="item-main">
                        <span class="item-name">${item.name || item}</span>
                        <span class="item-quantity">${item.quantity || 1}</span>
                    </div>
                    <div class="item-details ${conditionClass}">
                        <span class="item-condition">${condition}</span>
                        ${item.enchanted ? '<span class="item-enchanted">✧</span>' : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        inventoryContent.innerHTML = itemsHtml;
    }

    // Display enhanced map with annotations
    displayEnhancedMap(mapData, currentLocation, discoveries = []) {
        const mapContent = this.terminal.elements.mapPanel.querySelector('#asciiMap');
        
        if (mapData && mapData.ascii) {
            let enhancedMap = mapData.ascii;
            
            // Highlight current location
            enhancedMap = enhancedMap.replace('[X]', '[◉]');
            
            // Mark discoveries
            discoveries.forEach(discovery => {
                if (discovery.mapSymbol && discovery.mapPosition) {
                    enhancedMap = enhancedMap.replace(
                        discovery.mapPosition, 
                        discovery.mapSymbol
                    );
                }
            });
            
            mapContent.innerHTML = `
                <div class="map-header">Location: ${currentLocation}</div>
                <pre class="enhanced-map">${enhancedMap}</pre>
                <div class="map-legend">
                    <div>◉ Current Location</div>
                    <div>? Unexplored</div>
                    <div>! Point of Interest</div>
                </div>
            `;
        } else {
            mapContent.innerHTML = `
                <div class="map-header">Location: ${currentLocation || 'Unknown'}</div>
                <pre class="enhanced-map">
    ┌───────────────────┐
    │   UNMAPPED AREA   │
    │                   │
    │        [◉]        │
    │                   │
    └───────────────────┘
                </pre>
            `;
        }
    }

    // Skip current typewriter animation
    skipTypewriter() {
        if (this.isTyping) {
            this.typewriterSpeed = 1; // Speed up dramatically
            setTimeout(() => {
                this.typewriterSpeed = 30; // Reset to normal
            }, 100);
        }
    }

    // Set narrative display preferences
    setPreferences(preferences) {
        if (preferences.typewriterSpeed) {
            this.typewriterSpeed = preferences.typewriterSpeed;
        }
        
        if (preferences.autoScroll !== undefined) {
            this.autoScroll = preferences.autoScroll;
        }
        
        if (preferences.atmosphericEffects !== undefined) {
            this.atmosphericEffects = preferences.atmosphericEffects;
        }
    }
}

// Export for global access
window.NarrativeDisplay = NarrativeDisplay;