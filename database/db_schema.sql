CREATE DATABASE  IF NOT EXISTS `sigpe_test` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sigpe_test`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: sigpe_test
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `lastname` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `user_type` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

DROP TABLE IF EXISTS `pedidos_impresion`;

CREATE TABLE `pedidos_impresion` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,

  -- Relación y datos básicos
  `user_id` bigint unsigned DEFAULT NULL, -- cliente (opcional si tomás email directo)
  `email_contacto` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `cliente_nombre` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `titulo` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL, -- breve descripción del pedido

  -- Estado y prioridad
  `estado` enum('nuevo','en_revision','cotizado','aprobado','en_cola','imprimiendo','fallido','post_proceso','listo','entregado','cancelado')
      CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'nuevo',
  `prioridad` tinyint unsigned NOT NULL DEFAULT 3, -- 1=alta, 5=baja
  `is_urgente` tinyint(1) NOT NULL DEFAULT 0,

  -- Fechas
  `fecha_entrega_estimada` date DEFAULT NULL,
  `fecha_entregado` datetime DEFAULT NULL,

  -- Archivo / modelo
  `archivo_nombre` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `archivo_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `archivo_hash` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL, -- p.ej. sha256
  `cantidad` int unsigned NOT NULL DEFAULT 1,

  -- Parámetros de impresión
  `material` enum('PLA','PETG','ABS','TPU','ASA','Nylon','Otro')
      CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'PLA',
  `color` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `boquilla_mm` decimal(3,2) DEFAULT 0.40,
  `altura_capa_mm` decimal(4,3) DEFAULT 0.200,
  `relleno_pct` tinyint unsigned DEFAULT 15, -- 0..100
  `perimetros` tinyint unsigned DEFAULT 2,
  `capas_superiores` tinyint unsigned DEFAULT 4,
  `capas_inferiores` tinyint unsigned DEFAULT 4,
  `soportes` enum('ninguno','automatico','manual')
      CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'ninguno',
  `adhesion_cama` enum('ninguna','brim','raft')
      CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'ninguna',
  `escala_pct` tinyint unsigned DEFAULT 100,

  -- Estimaciones / costos
  `tiempo_estimado_min` int unsigned DEFAULT NULL,
  `peso_estimado_g` int unsigned DEFAULT NULL,
  `costo_estimado` decimal(10,2) DEFAULT NULL,
  `costo_final` decimal(10,2) DEFAULT NULL,

  -- Logística
  `metodo_entrega` enum('retiro','envio_correo','moto')
      CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'retiro',
  `direccion_entrega` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci,

  -- Flags estándar
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,

  -- Timestamps
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha_entrega_estimada` (`fecha_entrega_estimada`),
  CONSTRAINT `fk_pedidos_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL,

  -- Reglas básicas
  CONSTRAINT `chk_relleno_pct` CHECK (`relleno_pct` BETWEEN 0 AND 100),
  CONSTRAINT `chk_escala_pct` CHECK (`escala_pct` BETWEEN 10 AND 500),
  CONSTRAINT `chk_boquilla_mm` CHECK (`boquilla_mm` > 0 AND `boquilla_mm` <= 1.00),
  CONSTRAINT `chk_altura_capa_mm` CHECK (`altura_capa_mm` > 0 AND `altura_capa_mm` <= 1.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'sigpe_test'
--

--
-- Dumping routines for database 'sigpe_test'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-29 13:39:49
