import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "es" | "fr";

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  translations: Record<string, string>;
}

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Top Header
    "brand.name": "AI-Powered SEO Agency",
    "brand.tagline": "Real-Time Multi-Agent SEO & EEAT Intelligence",
    "header.search_placeholder": "Search keywords, competitors, content pieces, tools...",
    "header.trial_days_left": "Trial: {days} days left",
    "header.pro_license": "PRO LICENSE",
    "header.upgrade_pro": "Upgrade to Pro",
    "header.sync_firestore": "Sync Firestore",
    "header.syncing": "Syncing...",
    "header.export_pdf": "Export PDF",
    "header.add_keyword": "Add Keyword",
    "header.market_shifts": "Market Shifts",
    "header.live_monitoring": "LIVE MONITORING",
    "header.sign_out": "Sign Out",
    "header.sign_in": "Sign In / Register",
    "header.language": "Language",

    // Navigation Tabs
    "nav.overview": "Executive Overview",
    "nav.live_serp": "Live SERP Tracker",
    "nav.ai_audit": "AI Search & EEAT Audit",
    "nav.keywords": "Keywords & Entities",
    "nav.content_engine": "AI Content Engine",
    "nav.audio_transcripts": "Audio Transcripts",
    "nav.onpage_tech": "On-Page & Technical",
    "nav.packages_roi": "Packages & ROI",
    "nav.services_catalog": "Services Catalog",
    "nav.website_discovery": "Website Discovery",
    "nav.schema_generator": "Schema Generator",
    "nav.internal_linking": "Internal Linking",
    "nav.migration_seo": "Migration SEO",
    "nav.platform_guides": "Platform Guides",
    "nav.integrations": "Integrations Center",
    "nav.ai_consultant": "AI Consultant",
    "nav.project_mgmt": "Project Management",
    "nav.white_label": "White Label Suite",
    "nav.subscription_billing": "Subscription & Billing",

    // Overview KPIs
    "kpi.impact_score": "Campaign Impact Score",
    "kpi.ai_overview_share": "AI Overview Share",
    "kpi.top_3_rankings": "Top 3 Rankings",
    "kpi.organic_traffic": "Monthly Organic Traffic",
    "kpi.avg_position": "Avg Position",
    "kpi.eeat_score": "EEAT Authority Score",

    // Predictive Forecasting
    "forecast.title": "Predictive AI Impact Forecasting (30-Day Regression)",
    "forecast.subtitle": "Statistical least-squares regression model projecting 30-day campaign impact score velocity based on historical logs.",
    "forecast.current_score": "Current Impact Score",
    "forecast.predicted_day30": "Projected Day +30 Score",
    "forecast.projected_growth": "Forecasted Growth",
    "forecast.velocity": "Regression Velocity",
    "forecast.model_confidence": "Model Fit (R² Confidence)",
    "forecast.target_milestone": "Target Milestone (95+)",
    "forecast.historical_data": "Historical Actuals",
    "forecast.projected_trend": "30-Day Projected Regression",
    "forecast.confidence_band": "95% Confidence Band (±1.96σ)",
    "forecast.days_ahead": "Forecast Horizon",
    "forecast.7days": "Next 7 Days",
    "forecast.14days": "Next 14 Days",
    "forecast.30days": "Next 30 Days",
    "forecast.trajectory_mode": "Scenario Simulation",
    "forecast.mode_neutral": "Standard Trajectory",
    "forecast.mode_accelerated": "Accelerated Velocity (+25% Cadence)",
    "forecast.mode_conservative": "Conservative Hold",
    "forecast.ai_summary": "AI Predictive Drivers & Milestones",
    "forecast.points_per_day": "pts / day",

    // Backlink Check & Google Search Module
    "backlink.title": "Google Search API Backlink & Citation Explorer",
    "backlink.subtitle": "Automated domain citation scanner and backlink index count verifier powered by Google Search API grounding.",
    "backlink.domain_label": "Primary Target Domain",
    "backlink.run_check": "Run Google Backlink Check",
    "backlink.checking": "Scanning Google Search Index...",
    "backlink.total_backlinks": "Total Estimated Backlinks",
    "backlink.referring_domains": "Referring Unique Domains",
    "backlink.domain_trust": "Domain Citation Trust",
    "backlink.dofollow_ratio": "Dofollow Link Ratio",
    "backlink.query_executed": "Google Search Syntax Executed",
    "backlink.discovered_sources": "Discovered Referring Sources & Citations",
    "backlink.anchor_distribution": "Anchor Text Distribution",
    "backlink.opportunity_title": "AI Backlink Growth Targets",
    "backlink.source_url": "Source Page / URL",
    "backlink.snippet": "Context & Mention Snippet",
    "backlink.category": "Citation Type",
    "backlink.authority": "Authority Tier",
    "backlink.anchor": "Anchor Text",
    "backlink.link_type": "Link Type",

    // Common Buttons & Tooltips
    "btn.save": "Save Changes",
    "btn.cancel": "Cancel",
    "btn.export_csv": "Export CSV",
    "btn.download_pdf": "Download PDF Report",
    "btn.copy": "Copy to Clipboard",
    "btn.copied": "Copied!",
    "btn.refresh": "Refresh Data",
    "btn.filter": "Filter",
    "btn.delete": "Delete",
    "btn.edit": "Edit",
    "btn.view_all": "View All",
    "btn.run_audit": "Run Audit",
    "btn.close": "Close",

    // Tooltips
    "tooltip.theme_toggle": "Toggle light / dark mode theme",
    "tooltip.lang_toggle": "Change interface language",
    "tooltip.sync_firestore": "Persist workspace data to Firestore cloud database",
    "tooltip.pdf_export": "Generate pixel-perfect client PDF report",
    "tooltip.market_shifts": "View live Google search algorithm volatility notifications",
    "tooltip.ai_gatekeeper": "Google AI Studio Gatekeeper proxy status and rate limits",
  },

  es: {
    // Brand & Top Header
    "brand.name": "Agencia SEO Impulsada por IA",
    "brand.tagline": "Inteligencia SEO Multi-Agente y EEAT en Tiempo Real",
    "header.search_placeholder": "Buscar palabras clave, competidores, contenidos, herramientas...",
    "header.trial_days_left": "Prueba: {days} días restantes",
    "header.pro_license": "LICENCIA PRO",
    "header.upgrade_pro": "Actualizar a Pro",
    "header.sync_firestore": "Sincronizar Firestore",
    "header.syncing": "Sincronizando...",
    "header.export_pdf": "Exportar PDF",
    "header.add_keyword": "Añadir Palabra Clave",
    "header.market_shifts": "Cambios de Mercado",
    "header.live_monitoring": "MONITOREO EN VIVO",
    "header.sign_out": "Cerrar Sesión",
    "header.sign_in": "Iniciar Sesión / Registro",
    "header.language": "Idioma",

    // Navigation Tabs
    "nav.overview": "Resumen Ejecutivo",
    "nav.live_serp": "Rastreador SERP en Vivo",
    "nav.ai_audit": "Auditoría SEO IA y EEAT",
    "nav.keywords": "Palabras Clave y Entidades",
    "nav.content_engine": "Motor de Contenido IA",
    "nav.audio_transcripts": "Transcripciones de Audio",
    "nav.onpage_tech": "SEO On-Page y Técnico",
    "nav.packages_roi": "Paquetes y ROI",
    "nav.services_catalog": "Catálogo de Servicios",
    "nav.website_discovery": "Descubrimiento Web",
    "nav.schema_generator": "Generador de Schema",
    "nav.internal_linking": "Enlaces Internos",
    "nav.migration_seo": "SEO de Migración",
    "nav.platform_guides": "Guías de Plataforma",
    "nav.integrations": "Centro de Integraciones",
    "nav.ai_consultant": "Consultor IA",
    "nav.project_mgmt": "Gestión de Proyectos",
    "nav.white_label": "Marca Blanca",
    "nav.subscription_billing": "Suscripción y Facturación",

    // Overview KPIs
    "kpi.impact_score": "Puntuación de Impacto",
    "kpi.ai_overview_share": "Cuota en AI Overviews",
    "kpi.top_3_rankings": "Posiciones Top 3",
    "kpi.organic_traffic": "Tráfico Orgánico Mensual",
    "kpi.avg_position": "Posición Promedio",
    "kpi.eeat_score": "Puntuación de Autoridad EEAT",

    // Predictive Forecasting
    "forecast.title": "Pronóstico Predictivo de Impacto IA (Regresión a 30 Días)",
    "forecast.subtitle": "Modelo de regresión por mínimos cuadrados que proyecta la velocidad del impacto a 30 días según el historial.",
    "forecast.current_score": "Puntuación de Impacto Actual",
    "forecast.predicted_day30": "Puntuación Proyectada Día +30",
    "forecast.projected_growth": "Crecimiento Proyectado",
    "forecast.velocity": "Velocidad de Regresión",
    "forecast.model_confidence": "Ajuste del Modelo (Confianza R²)",
    "forecast.target_milestone": "Hito Objetivo (95+)",
    "forecast.historical_data": "Datos Históricos Reales",
    "forecast.projected_trend": "Tendencia Proyectada a 30 Días",
    "forecast.confidence_band": "Banda de Confianza 95% (±1.96σ)",
    "forecast.days_ahead": "Horizonte de Pronóstico",
    "forecast.7days": "Próximos 7 Días",
    "forecast.14days": "Próximos 14 Días",
    "forecast.30days": "Próximos 30 Días",
    "forecast.trajectory_mode": "Simulación de Escenarios",
    "forecast.mode_neutral": "Trayectoria Estándar",
    "forecast.mode_accelerated": "Velocidad Acelerada (+25% Cadencia)",
    "forecast.mode_conservative": "Mantenimiento Conservador",
    "forecast.ai_summary": "Factores e Hitos Predictivos de IA",
    "forecast.points_per_day": "pts / día",

    // Backlink Check & Google Search Module
    "backlink.title": "Explorador de Enlaces y Citaciones con Google Search API",
    "backlink.subtitle": "Escáner automatizado de citaciones y conteo de backlinks indexados en Google.",
    "backlink.domain_label": "Dominio Principal Objetivo",
    "backlink.run_check": "Ejecutar Verificación en Google",
    "backlink.checking": "Escaneando el Índice de Google...",
    "backlink.total_backlinks": "Total de Enlaces Estimados",
    "backlink.referring_domains": "Dominios de Referencia Únicos",
    "backlink.domain_trust": "Confianza de Citación del Dominio",
    "backlink.dofollow_ratio": "Ratio de Enlaces Dofollow",
    "backlink.query_executed": "Sintaxis de Búsqueda Google Ejecutada",
    "backlink.discovered_sources": "Fuentes y Citaciones Encontradas",
    "backlink.anchor_distribution": "Distribución de Textos de Ancla",
    "backlink.opportunity_title": "Oportunidades de Crecimiento de Enlaces IA",
    "backlink.source_url": "Página de Origen / URL",
    "backlink.snippet": "Contexto y Fragmento de Mención",
    "backlink.category": "Tipo de Citación",
    "backlink.authority": "Nivel de Autoridad",
    "backlink.anchor": "Texto de Ancla",
    "backlink.link_type": "Tipo de Enlace",

    // Common Buttons & Tooltips
    "btn.save": "Guardar Cambios",
    "btn.cancel": "Cancelar",
    "btn.export_csv": "Exportar CSV",
    "btn.download_pdf": "Descargar Informe PDF",
    "btn.copy": "Copiar al Portapapeles",
    "btn.copied": "¡Copiado!",
    "btn.refresh": "Actualizar Datos",
    "btn.filter": "Filtrar",
    "btn.delete": "Eliminar",
    "btn.edit": "Editar",
    "btn.view_all": "Ver Todo",
    "btn.run_audit": "Ejecutar Auditoría",
    "btn.close": "Cerrar",

    // Tooltips
    "tooltip.theme_toggle": "Cambiar tema claro / oscuro",
    "tooltip.lang_toggle": "Cambiar idioma de la interfaz",
    "tooltip.sync_firestore": "Guardar datos en la base de datos Firestore",
    "tooltip.pdf_export": "Generar informe PDF para clientes",
    "tooltip.market_shifts": "Ver alertas de volatilidad del algoritmo de Google",
    "tooltip.ai_gatekeeper": "Estado del proxy y límites de tasa de Google AI Studio",
  },

  fr: {
    // Brand & Top Header
    "brand.name": "Agence SEO Propulsée par IA",
    "brand.tagline": "Intelligence SEO Multi-Agents & EEAT en Temps Réel",
    "header.search_placeholder": "Rechercher mots-clés, concurrents, contenus, outils...",
    "header.trial_days_left": "Essai : {days} jours restants",
    "header.pro_license": "LICENCE PRO",
    "header.upgrade_pro": "Passer à la Version Pro",
    "header.sync_firestore": "Synchroniser Firestore",
    "header.syncing": "Synchronisation...",
    "header.export_pdf": "Exporter en PDF",
    "header.add_keyword": "Ajouter un Mot-Clé",
    "header.market_shifts": "Changements du Marché",
    "header.live_monitoring": "SURVEILLANCE EN DIRECT",
    "header.sign_out": "Déconnexion",
    "header.sign_in": "Connexion / Inscription",
    "header.language": "Langue",

    // Navigation Tabs
    "nav.overview": "Vue d'Ensemble Exécutive",
    "nav.live_serp": "Suivi SERP en Direct",
    "nav.ai_audit": "Audit SEO IA & EEAT",
    "nav.keywords": "Mots-Clés & Entités",
    "nav.content_engine": "Moteur de Contenu IA",
    "nav.audio_transcripts": "Transcriptions Audio",
    "nav.onpage_tech": "SEO On-Page & Technique",
    "nav.packages_roi": "Forfaits & ROI",
    "nav.services_catalog": "Catalogue de Services",
    "nav.website_discovery": "Découverte de Site",
    "nav.schema_generator": "Générateur de Schéma",
    "nav.internal_linking": "Maillage Interne",
    "nav.migration_seo": "SEO de Migration",
    "nav.platform_guides": "Guides Plateformes",
    "nav.integrations": "Centre d'Intégrations",
    "nav.ai_consultant": "Consultant IA",
    "nav.project_mgmt": "Gestion de Projet",
    "nav.white_label": "Marque Blanche",
    "nav.subscription_billing": "Abonnement & Facturation",

    // Overview KPIs
    "kpi.impact_score": "Score d'Impact Campagne",
    "kpi.ai_overview_share": "Part dans Google AI Overviews",
    "kpi.top_3_rankings": "Positions Top 3",
    "kpi.organic_traffic": "Trafic Organique Mensuel",
    "kpi.avg_position": "Position Moyenne",
    "kpi.eeat_score": "Score d'Autorité EEAT",

    // Predictive Forecasting
    "forecast.title": "Prévisions Prédictives d'Impact IA (Régression à 30 Jours)",
    "forecast.subtitle": "Modèle de régression des moindres carrés projetant l'évolution du score d'impact sur 30 jours.",
    "forecast.current_score": "Score d'Impact Actuel",
    "forecast.predicted_day30": "Score Projeté Jour +30",
    "forecast.projected_growth": "Croissance Projetée",
    "forecast.velocity": "Vélocité de Régression",
    "forecast.model_confidence": "Ajustement du Modèle (Confiance R²)",
    "forecast.target_milestone": "Objectif Majeur (95+)",
    "forecast.historical_data": "Données Historiques Réelles",
    "forecast.projected_trend": "Tendance Projetée à 30 Jours",
    "forecast.confidence_band": "Intervalle de Confiance 95% (±1.96σ)",
    "forecast.days_ahead": "Horizon de Prévision",
    "forecast.7days": "Prochains 7 Jours",
    "forecast.14days": "Prochains 14 Jours",
    "forecast.30days": "Prochains 30 Jours",
    "forecast.trajectory_mode": "Simulation de Scénarios",
    "forecast.mode_neutral": "Trajectoire Standard",
    "forecast.mode_accelerated": "Vélocité Accélérée (+25% Cadence)",
    "forecast.mode_conservative": "Maintien Prudent",
    "forecast.ai_summary": "Facteurs & Jalons Prédictifs de l'IA",
    "forecast.points_per_day": "pts / jour",

    // Backlink Check & Google Search Module
    "backlink.title": "Explorateur de Backlinks & Citations via Google Search API",
    "backlink.subtitle": "Scanner automatisé de citations de domaine et vérificateur d'indexation de backlinks Google.",
    "backlink.domain_label": "Domaine Cible Principal",
    "backlink.run_check": "Lancer l'Analyse Google",
    "backlink.checking": "Analyse de l'Index Google en cours...",
    "backlink.total_backlinks": "Total Estimé de Backlinks",
    "backlink.referring_domains": "Domaines Référents Uniques",
    "backlink.domain_trust": "Confiance de Citation du Domaine",
    "backlink.dofollow_ratio": "Ratio de Liens Dofollow",
    "backlink.query_executed": "Syntaxe de Recherche Google Exécutée",
    "backlink.discovered_sources": "Sources Référentes & Citations Détectées",
    "backlink.anchor_distribution": "Répartition des Textes d'Ancre",
    "backlink.opportunity_title": "Cibles d'Acquisition de Liens IA",
    "backlink.source_url": "Page Source / URL",
    "backlink.snippet": "Contexte & Extrait de Citation",
    "backlink.category": "Type de Citation",
    "backlink.authority": "Niveau d'Autorité",
    "backlink.anchor": "Texte d'Ancre",
    "backlink.link_type": "Type de Lien",

    // Common Buttons & Tooltips
    "btn.save": "Enregistrer",
    "btn.cancel": "Annuler",
    "btn.export_csv": "Exporter en CSV",
    "btn.download_pdf": "Télécharger le Rapport PDF",
    "btn.copy": "Copier dans le Presse-papier",
    "btn.copied": "Copié !",
    "btn.refresh": "Actualiser",
    "btn.filter": "Filtrer",
    "btn.delete": "Supprimer",
    "btn.edit": "Modifier",
    "btn.view_all": "Voir Tout",
    "btn.run_audit": "Lancer l'Audit",
    "btn.close": "Fermer",

    // Tooltips
    "tooltip.theme_toggle": "Basculer entre mode clair et sombre",
    "tooltip.lang_toggle": "Changer la langue de l'interface",
    "tooltip.sync_firestore": "Sauvegarder dans la base de données cloud Firestore",
    "tooltip.pdf_export": "Générer un rapport PDF client haute définition",
    "tooltip.market_shifts": "Voir les alertes de volatilité des algorithmes Google",
    "tooltip.ai_gatekeeper": "État du proxy et quotas Google AI Studio",
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = "omnirank_app_language";

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "es" || saved === "fr" || saved === "en") {
        return saved;
      }
    } catch {
      // fallback
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const t = (key: string, fallback?: string): string => {
    const currentDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (currentDict[key]) {
      return currentDict[key];
    }
    const enDict = TRANSLATIONS.en;
    if (enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations: TRANSLATIONS[language] || TRANSLATIONS.en,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
