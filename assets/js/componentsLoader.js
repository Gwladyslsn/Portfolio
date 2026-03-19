

class ComponentLoader {
    static #cache = new Map();
    static #loadingPromises = new Map();

    /**
     * Charge un composant HTML externe et l'injecte dans le DOM
     * @param {string} componentName - Nom du composant (ex: 'header', 'footer')
     * @param {string} containerSelector - Sélecteur CSS du conteneur cible
     * @returns {Promise<void>}
     */
    static async load(componentName, containerSelector) {
        const container = document.querySelector(containerSelector);
        
        if (!container) {
            console.warn(`⚠️ Conteneur introuvable: ${containerSelector}`);
            return;
        }

        try {
            // Récupérer le HTML du composant
            const html = await this.#fetchComponent(componentName);
            
            // Injecter dans le DOM
            container.innerHTML = html;
            
            // Exécuter les scripts du composant s'il y en a
            this.#executeScripts(container);
            
            // Dispatcher un événement custom pour les listeners
            window.dispatchEvent(
                new CustomEvent('componentLoaded', { 
                    detail: { component: componentName } 
                })
            );
        } catch (error) {
            console.error(`❌ Erreur lors du chargement du composant ${componentName}:`, error);
            container.innerHTML = `<p>Erreur lors du chargement du composant</p>`;
        }
    }

    /**
     * Charge plusieurs composants en parallèle
     * @param {Array<{name: string, selector: string}>} components
     * @returns {Promise<void>}
     */
    static async loadMultiple(components) {
        return Promise.all(
            components.map(({ name, selector }) => this.load(name, selector))
        );
    }

    /**
     * Fetch le composant avec cache en mémoire
     * @private
     */
    static async #fetchComponent(componentName) {
        // Vérifier le cache
        if (this.#cache.has(componentName)) {
            return this.#cache.get(componentName);
        }

        // Éviter les requêtes en double (race condition)
        if (this.#loadingPromises.has(componentName)) {
            return this.#loadingPromises.get(componentName);
        }

        // Créer la promesse de fetch
        const fetchPromise = this.#performFetch(componentName);
        this.#loadingPromises.set(componentName, fetchPromise);

        try {
            const html = await fetchPromise;
            this.#cache.set(componentName, html); // Mettre en cache
            this.#loadingPromises.delete(componentName);
            return html;
        } catch (error) {
            this.#loadingPromises.delete(componentName);
            throw error;
        }
    }

    /**
     * Effectue le fetch réel
     * @private
     */
    static async #performFetch(componentName) {
        const filePath = `/html/components/${componentName}.html`;
        
        const response = await fetch(filePath, {
            method: 'GET',
            cache: 'force-cache', // Utiliser le cache du navigateur en priorité
            headers: {
                'Accept': 'text/html'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${componentName}.html introuvable`);
        }

        return response.text();
    }

    /**
     * Exécute les scripts contenus dans un élément
     * (utile si le composant a du JS inline)
     * @private
     */
    static #executeScripts(container) {
        container.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement('script');
            
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            
            newScript.async = false;
            document.body.appendChild(newScript);
        });
    }

    /**
     * Vide le cache (utile pour dev ou hot-reload)
     */
    static clearCache() {
        this.#cache.clear();
        console.log('✓ Cache vidé');
    }
}


// AUTO-LOAD COMPONENTS (optionnel)


document.addEventListener('DOMContentLoaded', () => {
    const componentsToLoad = document.querySelectorAll('[data-component]');
    
    if (componentsToLoad.length > 0) {
        const components = Array.from(componentsToLoad).map(el => ({
            name: el.getAttribute('data-component'),
            selector: `[data-component="${el.getAttribute('data-component')}"]`
        }));

        ComponentLoader.loadMultiple(components);
    }
});

// Export pour utilisation
export default ComponentLoader;