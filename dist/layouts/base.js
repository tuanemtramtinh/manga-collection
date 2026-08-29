import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Sun, Moon } from 'lucide-static';
const BaseLayout = ({ title = 'My App', userEmail, children }) => {
    return (_jsxs("html", { lang: "vi", "data-theme": "light", children: [_jsxs("head", { children: [_jsx("meta", { charset: "UTF-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), _jsx("title", { children: title }), _jsx("link", { rel: "stylesheet", href: "/public/output.css" }), _jsx("script", { dangerouslySetInnerHTML: { __html: `
          const t = localStorage.getItem('theme') || 'light'
          document.documentElement.setAttribute('data-theme', t)
        ` } })] }), _jsxs("body", { class: "min-h-screen bg-base-200", children: [_jsxs("header", { class: "fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-end px-3 bg-base-200/95 backdrop-blur-sm border-b border-base-200", children: [_jsxs("button", { id: "theme-toggle", class: "btn btn-ghost btn-sm btn-circle", title: "\u0110\u1ED5i giao di\u1EC7n", "aria-label": "Toggle dark mode", children: [_jsx("span", { id: "icon-sun", dangerouslySetInnerHTML: { __html: Sun.replace(/width="\d+"/, 'width="18"').replace(/height="\d+"/, 'height="18"') } }), _jsx("span", { id: "icon-moon", dangerouslySetInnerHTML: { __html: Moon.replace(/width="\d+"/, 'width="18"').replace(/height="\d+"/, 'height="18"') } })] }), userEmail && (_jsxs("div", { class: "dropdown dropdown-end", children: [_jsxs("button", { tabindex: 0, class: "btn btn-ghost btn-sm gap-1.5 normal-case", children: [_jsx("span", { class: "text-xs text-base-content/60 max-w-[140px] truncate", children: userEmail }), _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", children: _jsx("path", { d: "m6 9 6 6 6-6" }) })] }), _jsx("ul", { tabindex: 0, class: "dropdown-content menu menu-sm bg-base-100 rounded-box shadow-lg border border-base-200 w-40 mt-1 z-50", children: _jsx("li", { children: _jsx("form", { method: "post", action: "/logout", children: _jsx("button", { type: "submit", class: "w-full text-left text-error", children: "\u0110\u0103ng xu\u1EA5t" }) }) }) })] }))] }), _jsxs("div", { class: "pt-12", children: [children, _jsx("div", { id: "toast-container", class: "toast toast-top toast-center z-[100]" }), _jsx("script", { dangerouslySetInnerHTML: { __html: `
          (function() {
            const params = new URLSearchParams(location.search)
            const messages = {
              welcome: 'Tạo tài khoản thành công! Chào mừng bạn.',
              login:   'Đăng nhập thành công!',
            }
            const key = ['welcome', 'login'].find(k => params.get(k) === '1')
            if (key) {
              const container = document.getElementById('toast-container')
              if (container) {
                const alert = document.createElement('div')
                alert.className = 'alert alert-success shadow-lg'
                alert.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span>' + messages[key] + '</span>'
                container.appendChild(alert)
                setTimeout(() => alert.remove(), 4000)
              }
              history.replaceState(null, '', location.pathname)
            }
          })()
        ` } }), _jsx("script", { src: "/public/js/main.js", defer: true })] })] })] }));
};
export default BaseLayout;
