// --- fichier: frontend/src/components/Dashboard/Charts/TaskProgressChart.js ---
import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip, Legend, Sector 
} from 'recharts';
import { motion } from 'framer-motion';
import styles from './TaskProgressChart.module.css';

// Données simulées pour le graphique
const mockData = [
  { name: 'Complétées', value: 42, color: 'rgba(253, 126, 20, 0.9)' },
  { name: 'En cours', value: 28, color: 'rgba(253, 126, 20, 0.5)' },
  { name: 'En attente', value: 15, color: 'rgba(255, 255, 255, 0.3)' },
  { name: 'En retard', value: 8, color: 'rgba(239, 68, 68, 0.7)' }
];

const TaskProgressChart = ({ isLoading = false }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  
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

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Composant de rendu pour le secteur actif
  const renderActiveShape = (props) => {
    const { 
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, value
    } = props;
  
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className={styles.activeSector}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 13}
          fill={fill}
          className={styles.outerRing}
        />
        <text
          x={cx}
          y={cy - 5}
          dy={8}
          textAnchor="middle"
          fill="#FFFFFF"
          className={styles.centerLabel}
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy + 15}
          dy={8}
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.7)"
          className={styles.centerValue}
        >
          {value} tâches
        </text>
      </g>
    );
  };

  // Composant pour le tooltip personnalisé
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{payload[0].name}</p>
          <p className={styles.tooltipValue}>
            <span>{payload[0].value}</span> tâches
          </p>
          <p className={styles.tooltipPercent}>
            {Math.round((payload[0].value / mockData.reduce((a, b) => a + b.value, 0)) * 100)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Calcul du total des tâches
  const totalTasks = mockData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <motion.div 
      className={styles.chartContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.chartHeader}>
        <h2 className={styles.chartTitle}>Progression des Tâches</h2>
        <div className={styles.headerControls}>
          <select className={styles.periodSelector}>
            <option>Cette semaine</option>
            <option>Ce mois</option>
            <option>Ce trimestre</option>
          </select>
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
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={mockData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {mockData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className={styles.pieCell}
                      strokeWidth={2}
                      stroke="rgba(30, 30, 35, 0.7)"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  formatter={(value, entry, index) => (
                    <span className={styles.legendItem}>{value}</span>
                  )}
                  className={styles.legend}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className={styles.statsSummary}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{totalTasks}</span>
              <span className={styles.statLabel}>Tâches totales</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{mockData[0].value}</span>
              <span className={styles.statLabel}>Complétées</span>
              <motion.div 
                className={styles.statProgress}
                initial={{ width: 0 }}
                animate={{ width: `${(mockData[0].value / totalTasks) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                style={{ background: mockData[0].color }}
              ></motion.div>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{mockData[3].value}</span>
              <span className={styles.statLabel}>En retard</span>
              <motion.div 
                className={styles.statProgress}
                initial={{ width: 0 }}
                animate={{ width: `${(mockData[3].value / totalTasks) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                style={{ background: mockData[3].color }}
              ></motion.div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TaskProgressChart;
