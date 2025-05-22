// --- fichier: frontend/src/components/Dashboard/Charts/ActivityTimelineChart.js ---
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { motion } from 'framer-motion';
import moment from 'moment';
import 'moment/locale/fr';
import styles from './ActivityTimelineChart.module.css';

// Configuration de moment.js en français
moment.locale('fr');

// Données simulées pour la timeline d'activité (14 derniers jours)
const generateMockData = () => {
  const data = [];
  const now = moment();
  
  for (let i = 13; i >= 0; i--) {
    const date = moment(now).subtract(i, 'days');
    
    // Générer des valeurs aléatoires pour les différentes activités
    data.push({
      date: date.format('YYYY-MM-DD'),
      label: i === 0 ? "Aujourd'hui" : i === 1 ? 'Hier' : date.format('D MMM'),
      tâchesCreées: Math.floor(Math.random() * 6) + 1,
      tâchesComplétées: Math.floor(Math.random() * 8),
      commentaires: Math.floor(Math.random() * 12),
    });
  }
  
  return data;
};

const mockData = generateMockData();

const ActivityTimelineChart = ({ isLoading = false }) => {
  const [activeDataKey, setActiveDataKey] = useState('tâchesComplétées');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);
  
  useEffect(() => {
    // Simuler la fin de l'animation après 2 secondes
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  // Gestion du changement de type de données
  const handleDataTypeChange = (type) => {
    setActiveDataKey(type);
  };
  
  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipDate}>{data.label}</p>
          <div className={styles.tooltipContent}>
            <div className={styles.tooltipItem}>
              <span className={styles.tooltipDot} style={{ background: 'rgba(253, 126, 20, 0.9)' }}></span>
              <span className={styles.tooltipLabel}>Tâches créées:</span>
              <span className={styles.tooltipValue}>{data.tâchesCreées}</span>
            </div>
            <div className={styles.tooltipItem}>
              <span className={styles.tooltipDot} style={{ background: 'rgba(253, 126, 20, 0.6)' }}></span>
              <span className={styles.tooltipLabel}>Tâches complétées:</span>
              <span className={styles.tooltipValue}>{data.tâchesComplétées}</span>
            </div>
            <div className={styles.tooltipItem}>
              <span className={styles.tooltipDot} style={{ background: 'rgba(255, 255, 255, 0.5)' }}></span>
              <span className={styles.tooltipLabel}>Commentaires:</span>
              <span className={styles.tooltipValue}>{data.commentaires}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Obtenir la valeur max pour l'axe Y
  const getMaxValue = () => {
    if (activeDataKey === 'tout') {
      return Math.max(
        ...mockData.map(item => Math.max(
          item.tâchesCreées + item.tâchesComplétées + item.commentaires
        ))
      );
    }
    return Math.max(...mockData.map(item => item[activeDataKey])) + 2;
  };

  // Pour l'affichage des jours actuels/passés
  const today = moment().format('YYYY-MM-DD');
  
  return (
    <motion.div 
      className={styles.chartContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.chartHeader}>
        <h2 className={styles.chartTitle}>Chronologie d'Activité</h2>
        <div className={styles.headerControls}>
          <div className={styles.dataTypeSelector}>
            <button 
              className={`${styles.dataTypeButton} ${activeDataKey === 'tâchesComplétées' ? styles.active : ''}`}
              onClick={() => handleDataTypeChange('tâchesComplétées')}
            >
              Complétées
            </button>
            <button 
              className={`${styles.dataTypeButton} ${activeDataKey === 'tâchesCreées' ? styles.active : ''}`}
              onClick={() => handleDataTypeChange('tâchesCreées')}
            >
              Créées
            </button>
            <button 
              className={`${styles.dataTypeButton} ${activeDataKey === 'commentaires' ? styles.active : ''}`}
              onClick={() => handleDataTypeChange('commentaires')}
            >
              Commentaires
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Chargement des données...</p>
        </div>
      ) : (
        <div className={styles.chartContent}>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={mockData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                onMouseMove={(e) => {
                  if (e && e.activePayload) {
                    setHoveredDate(e.activePayload[0].payload.date);
                  }
                }}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <defs>
                  <linearGradient id="colorTâchesComplétées" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(253, 126, 20, 0.8)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="rgba(253, 126, 20, 0.2)" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="colorTâchesCreées" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(253, 126, 20, 0.9)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="rgba(253, 126, 20, 0.3)" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="colorCommentaires" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(255, 255, 255, 0.7)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="rgba(255, 255, 255, 0.1)" stopOpacity={0.2} />
                  </linearGradient>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="rgba(255, 255, 255, 0.05)" 
                />
                
                <XAxis 
                  dataKey="label" 
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                  dy={10}
                />
                
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
                  domain={[0, getMaxValue()]}
                  allowDecimals={false}
                />
                
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1 }}
                />
                
                <ReferenceLine 
                  x={mockData.find(d => d.date === today)?.label} 
                  stroke="rgba(253, 126, 20, 0.7)" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{
                    value: "Aujourd'hui",
                    position: 'top',
                    fill: 'rgba(253, 126, 20, 0.9)',
                    fontSize: 12
                  }}
                />
                
                {activeDataKey === 'tâchesComplétées' && (
                  <Area 
                    type="monotone" 
                    dataKey="tâchesComplétées" 
                    stroke="rgba(253, 126, 20, 0.9)" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTâchesComplétées)"
                    animationDuration={1500}
                  />
                )}
                
                {activeDataKey === 'tâchesCreées' && (
                  <Area 
                    type="monotone" 
                    dataKey="tâchesCreées" 
                    stroke="rgba(253, 126, 20, 0.9)" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTâchesCreées)"
                    animationDuration={1500}
                  />
                )}
                
                {activeDataKey === 'commentaires' && (
                  <Area 
                    type="monotone" 
                    dataKey="commentaires" 
                    stroke="rgba(255, 255, 255, 0.7)" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCommentaires)"
                    animationDuration={1500}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <motion.div 
            className={styles.summarySection}
            variants={itemVariants}
          >
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>
                {mockData.reduce((sum, item) => sum + item.tâchesCreées, 0)}
              </span>
              <span className={styles.summaryLabel}>Tâches créées</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>
                {mockData.reduce((sum, item) => sum + item.tâchesComplétées, 0)}
              </span>
              <span className={styles.summaryLabel}>Tâches complétées</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>
                {mockData.reduce((sum, item) => sum + item.commentaires, 0)}
              </span>
              <span className={styles.summaryLabel}>Commentaires</span>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ActivityTimelineChart;
