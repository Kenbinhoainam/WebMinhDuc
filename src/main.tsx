import React from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import {RouteMetadata} from './seo/RouteMetadata';
import './styles.css';
const root=document.getElementById('root')!;
const app=<React.StrictMode><BrowserRouter><RouteMetadata/><App/></BrowserRouter></React.StrictMode>;
const canonical=document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
const sameRoute=canonical && new URL(canonical.href).pathname.replace(/\/$/,'')===location.pathname.replace(/\/$/,'');
// A query can alter the jobs list before hydration; fallback routes may serve the home shell.
if(root.hasChildNodes() && sameRoute && !location.search) hydrateRoot(root,app);
else createRoot(root).render(app);
