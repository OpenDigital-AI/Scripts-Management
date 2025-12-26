import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);
app.use(router);
app.mount('#app');

// Listen for session expiry events dispatched by the Cloudbase service
if (typeof window !== 'undefined') {
	window.addEventListener('session-expired', () => {
		try {
			console.log('Session expired event received — redirecting to login');
			router.push('/login');
		} catch (e) {
			console.warn('Failed to navigate on session-expired:', e);
		}
	});
}
