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
-- Table structure for table `3d_models`
--

DROP TABLE IF EXISTS `3d_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `3d_models` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int unsigned NOT NULL,
  `file_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `file_format` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `file_size` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `file_path` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `s3_key` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `s3_url` varchar(512) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_model_order_idx` (`order_id`),
  CONSTRAINT `fk_model_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `3d_models`
--

LOCK TABLES `3d_models` WRITE;
/*!40000 ALTER TABLE `3d_models` DISABLE KEYS */;
INSERT INTO `3d_models` VALUES (1,14,'FinalBaseMesh.obj','obj','2521.26 KB',NULL,'2025-11-09 05:57:17','2025-11-09 02:57:17','models3d/20251109/65f3a2fb6ffc43cabf4342e985c05fcb.obj','https://sigpe-test.s3.us-east-2.amazonaws.com/models3d/20251109/65f3a2fb6ffc43cabf4342e985c05fcb.obj'),(2,15,'e038ec008033488b97cfefe2b34301d3.obj','obj','2521.26 KB',NULL,'2025-11-09 05:57:17','2025-11-09 02:57:17','models3d/20251109/01bb4c6dc81548ac8fd138f1828a434f.obj','https://sigpe-test.s3.us-east-2.amazonaws.com/models3d/20251109/01bb4c6dc81548ac8fd138f1828a434f.obj'),(3,21,'12140_Skull_v3_L2.obj','obj','6026.39 KB',NULL,'2025-11-09 05:57:17','2025-11-09 02:57:17','models3d/20251109/89b9ff7b6c0f4c16bef76088dbb6df85.obj','https://sigpe-test.s3.us-east-2.amazonaws.com/models3d/20251109/89b9ff7b6c0f4c16bef76088dbb6df85.obj'),(4,22,'FinalBaseMesh.obj','obj','2521.26 KB',NULL,'2025-11-09 21:10:02','2025-11-09 18:10:02','models3d/20251109/a1141247e61f4b05996172c90a5d253b.obj','https://sigpe-test.s3.us-east-2.amazonaws.com/models3d/20251109/a1141247e61f4b05996172c90a5d253b.obj'),(5,25,'12140_Skull_v3_L2.obj','obj','6026.39 KB',NULL,'2025-11-10 03:44:06','2025-11-10 00:44:06','models3d/20251110/6903a4cdc19d4236b0530184cfc868ee.obj','https://sigpe-test.s3.us-east-2.amazonaws.com/models3d/20251110/6903a4cdc19d4236b0530184cfc868ee.obj');
/*!40000 ALTER TABLE `3d_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alembic_version`
--

DROP TABLE IF EXISTS `alembic_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alembic_version` (
  `version_num` varchar(32) COLLATE utf8mb4_spanish_ci NOT NULL,
  PRIMARY KEY (`version_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alembic_version`
--

LOCK TABLES `alembic_version` WRITE;
/*!40000 ALTER TABLE `alembic_version` DISABLE KEYS */;
INSERT INTO `alembic_version` VALUES ('add_is_completed_delivery_amount');
/*!40000 ALTER TABLE `alembic_version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `user_id` int unsigned NOT NULL,
  `license_number` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `institution_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `speciality` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `is_verified` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_doctor_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (2,'LM-9845','Hospital Universitario','Traumatología',1),(3,'PS-7763','Clínica del Oeste','Rehabilitación',1),(6,'string','string','string',1),(7,'OD-4521','Clínica Dental Sonrisa','Odontología',1),(8,'TO-8834','Centro de Rehabilitación Integral','Terapia Ocupacional',1);
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `price_modifier` float DEFAULT NULL,
  `amount_mts` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES (1,'PLA Blanco',0.05,NULL),(2,'ABS Negro',0.1,NULL),(3,'PETG Transparente',0.08,NULL),(4,'TPU Flexible',0.15,NULL),(5,'Resina Dental',0.12,NULL),(6,'Nylon Reforzado',0.18,NULL);
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_orders`
--

DROP TABLE IF EXISTS `medical_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_orders` (
  `order_id` int unsigned NOT NULL,
  `patient_id` int unsigned NOT NULL,
  `urgency_level` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'Estándar' COMMENT 'tipos posibles: ''Estándar'', ''Prioritario'', ''Urgente''',
  `pathology` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `medical_observations` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `priority_level` int DEFAULT NULL COMMENT 'se va a encargar de ordenar por nivel de prioridad segun algun usuario lo determine',
  PRIMARY KEY (`order_id`,`patient_id`),
  KEY `fk_medical_patient_idx` (`patient_id`),
  CONSTRAINT `fk_medical_order_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_medical_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_orders`
--

LOCK TABLES `medical_orders` WRITE;
/*!40000 ALTER TABLE `medical_orders` DISABLE KEYS */;
INSERT INTO `medical_orders` VALUES (6,1,'Urgente','string','string',4),(12,2,'Media','asdasd','asdasd',NULL),(13,2,'Alta','djaklsd','asjdklajdklasd',NULL),(14,2,'Alta','asdad','',NULL),(15,2,'Media','assdadasd','',NULL),(16,2,'Baja','sdfsf','',NULL),(17,2,'Media','assdas','',NULL),(18,3,'Alta','Bruxismo severo','Paciente con desgaste dental avanzado, requiere férula de uso nocturno',NULL),(19,4,'Media','Parálisis parcial mano derecha','Necesita órtesis funcional para actividades de vida diaria',NULL),(20,3,'Baja','Mantenimiento post-ortodoncia','Completó tratamiento ortodóncico hace 2 semanas',NULL),(21,2,'Alta','assdad','',NULL),(23,2,'Baja','assda','',NULL);
/*!40000 ALTER TABLE `medical_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `order_id` int unsigned NOT NULL,
  `message` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `is_read` tinyint NOT NULL DEFAULT '0',
  `type` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `current_stage` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT 'null',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_notification_user_idx` (`user_id`),
  KEY `fk_notifications_order_idx` (`order_id`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_notifications_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,2,3,'Orden realizada',0,'aviso','en revision','2025-11-08 02:30:55','2025-11-07 23:30:55'),(2,2,4,'Orden realizada',0,'aviso','en revision','2025-11-08 04:11:07','2025-11-08 01:11:07'),(3,6,5,'Orden realizada',0,'aviso','en revision','2025-11-08 04:25:32','2025-11-08 01:25:32'),(4,6,6,'Orden realizada',0,'aviso','en revision','2025-11-08 04:50:48','2025-11-08 01:50:48'),(5,6,7,'Orden realizada',0,'aviso','en revision','2025-11-08 05:38:56','2025-11-08 02:38:56'),(6,6,8,'Orden realizada',0,'aviso','en revision','2025-11-08 05:39:46','2025-11-08 02:39:46'),(7,6,9,'Orden realizada',0,'aviso','en revision','2025-11-08 23:45:16','2025-11-08 20:45:16'),(8,6,10,'Orden realizada',0,'aviso','en revision','2025-11-08 23:46:06','2025-11-08 20:46:06'),(9,6,11,'Orden realizada',0,'aviso','en revision','2025-11-08 23:47:22','2025-11-08 20:47:22'),(10,6,12,'Orden realizada',0,'aviso','en revision','2025-11-09 00:43:27','2025-11-08 21:43:27'),(11,6,13,'Orden realizada',0,'aviso','en revision','2025-11-09 00:53:35','2025-11-08 21:53:35'),(12,6,14,'Orden realizada',0,'aviso','en revision','2025-11-09 03:01:21','2025-11-09 00:01:21'),(13,6,15,'Orden realizada',0,'aviso','en revision','2025-11-09 03:13:34','2025-11-09 00:13:34'),(14,6,16,'Orden realizada',0,'aviso','en revision','2025-11-09 03:13:55','2025-11-09 00:13:55'),(15,6,17,'Orden realizada',0,'aviso','en revision','2025-11-09 03:18:38','2025-11-09 00:18:38'),(16,7,18,'Orden realizada',0,'aviso','en revision','2025-11-09 03:41:40','2025-11-09 00:41:40'),(17,8,19,'Orden realizada',0,'aviso','en revision','2025-11-09 03:41:40','2025-11-09 00:41:40'),(18,7,20,'Orden realizada',0,'aviso','en revision','2025-11-09 03:41:40','2025-11-09 00:41:40'),(19,6,21,'Orden realizada',1,'aviso','en revision','2025-11-09 03:51:05','2025-11-09 23:35:28'),(20,10,22,'Orden realizada',1,'aviso','en revision','2025-11-09 18:29:39','2025-11-10 00:44:06'),(21,6,23,'Orden realizada',1,'aviso','en revision','2025-11-09 23:04:38','2025-11-09 23:35:28'),(22,14,24,'Orden realizada',0,'aviso','en revision','2025-11-10 00:57:27','2025-11-09 21:57:27'),(23,15,25,'Orden realizada',1,'aviso','en revision','2025-11-10 03:27:53','2025-11-10 00:44:06'),(24,16,26,'Orden realizada',1,'aviso','en revision','2025-11-10 03:57:07','2025-11-10 03:49:47'),(25,16,27,'Orden realizada',1,'aviso','en revision','2025-11-10 04:00:45','2025-11-10 03:49:47'),(26,16,28,'Orden realizada',1,'aviso','en revision','2025-11-10 15:57:06','2025-11-10 15:47:16'),(27,16,29,'Orden realizada',1,'aviso','en revision','2025-11-10 16:11:13','2025-11-10 15:47:16'),(28,16,30,'Orden realizada',0,'aviso','en revision','2025-11-10 18:10:46','2025-11-10 15:10:46');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `observations`
--

DROP TABLE IF EXISTS `observations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `observations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `order_id` int unsigned DEFAULT NULL,
  `type` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `comment` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_observation_user_idx` (`user_id`),
  KEY `fk_observations_order_idx` (`order_id`),
  CONSTRAINT `fk_observation_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_observations_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observations`
--

LOCK TABLES `observations` WRITE;
/*!40000 ALTER TABLE `observations` DISABLE KEYS */;
/*!40000 ALTER TABLE `observations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `technician_id` int DEFAULT NULL,
  `prosthesis_id` int unsigned DEFAULT NULL,
  `material_id` int unsigned NOT NULL COMMENT 'aca lo ideal creo que seria poner directamente el filamento a usar junto con su tipo y que la logica de negocio para elegirlo este en el frontend',
  `is_medical` tinyint NOT NULL DEFAULT '0',
  `has_design` tinyint NOT NULL DEFAULT '0',
  `processing_level` varchar(128) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `current_stage` varchar(128) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `delivery_date` datetime DEFAULT NULL,
  `specification` varchar(1024) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `full_price` float DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `fk_order_prosthesis_idx` (`prosthesis_id`),
  KEY `fk_order_user_idx` (`user_id`),
  KEY `fk_order_material_idx` (`material_id`),
  CONSTRAINT `fk_order_material` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`),
  CONSTRAINT `fk_order_prosthesis` FOREIGN KEY (`prosthesis_id`) REFERENCES `prostheses` (`id`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (3,2,10,1,1,1,0,'Diseño','lo saque de la impresora todo bien y listo para entregar','2025-11-27 23:30:00','Muñequera personalizada para paciente con fractura de radio',6300,'2025-11-08 02:30:55','2025-11-10 15:47:16',1),(4,2,NULL,1,1,1,0,'Diseño','En revisión','2025-11-12 10:30:00','Prueba de orden con IDs válidos',6300,'2025-11-08 04:11:07','2025-11-08 01:11:07',0),(5,6,NULL,1,1,0,1,'no se','en espera  ?? asdasda','2025-11-08 04:21:13','string',6300,'2025-11-08 07:25:20','2025-11-08 04:25:20',0),(6,6,NULL,2,3,1,0,'string','string','2025-11-08 04:50:13','string',15360,'2025-11-08 07:49:45','2025-11-08 04:49:45',0),(7,6,NULL,2,1,0,0,'string','string','2025-11-08 05:38:49','string',15000,'2025-11-08 08:37:13','2025-11-08 05:37:13',0),(8,6,NULL,2,1,0,0,'string','string','2025-11-08 05:38:49','string',15000,'2025-11-08 08:39:33','2025-11-08 05:39:33',0),(9,6,NULL,2,2,0,1,'qasdqdqsd',NULL,NULL,'sdasdasds',15600,'2025-11-09 01:50:39','2025-11-08 22:50:39',0),(10,6,NULL,1,4,0,0,'23',NULL,NULL,'12312',6900,'2025-11-09 01:50:39','2025-11-08 22:50:39',0),(11,6,10,3,3,0,0,'123123213',NULL,'2025-11-28 08:22:00','4141414',5900,'2025-11-09 01:50:39','2025-11-10 15:47:16',0),(12,6,NULL,2,2,1,1,'assdassd',NULL,NULL,'asdasd',15600,'2025-11-09 03:34:55','2025-11-09 00:34:55',0),(13,6,NULL,2,2,1,1,'ssgsdg',NULL,NULL,'sdgsdgs',15600,'2025-11-09 03:34:55','2025-11-09 00:34:55',0),(14,6,NULL,2,2,1,1,'assdassd',NULL,NULL,'asdadadad',15600,'2025-11-09 05:57:17','2025-11-09 02:57:17',0),(15,6,NULL,2,2,1,1,'sdd1dqdas',NULL,NULL,'ads1ssdas',15600,'2025-11-09 05:57:17','2025-11-09 02:57:17',0),(16,6,NULL,3,3,1,0,'fdasfsdfsd',NULL,NULL,'sdfsdfsdf',5900,'2025-11-09 05:57:17','2025-11-09 02:57:17',0),(17,6,NULL,2,2,1,0,'asdas',NULL,NULL,'assds',15600,'2025-11-09 05:57:17','2025-11-09 02:57:17',0),(18,7,NULL,4,5,1,0,'Diseño','En revisión',NULL,'Férula personalizada para paciente con bruxismo severo',8960,'2025-11-09 03:41:40','2025-11-09 00:41:40',0),(19,8,NULL,6,6,1,1,'Fabricación','En proceso',NULL,'Órtesis de mano derecha con adaptación personalizada',11210,'2025-11-09 03:41:40','2025-11-09 00:41:40',0),(20,7,NULL,5,5,1,0,'Revisión','Pendiente',NULL,'Retenedor inferior post-tratamiento ortodóncico',8400,'2025-11-09 03:41:40','2025-11-09 00:41:40',0),(21,6,NULL,7,4,1,1,'fdfgdfg',NULL,NULL,'dfgdfg',7475,'2025-11-09 05:57:17','2025-11-09 02:57:17',0),(22,10,10,2,2,0,1,'asdad',NULL,NULL,'asdsasssd',15600,'2025-11-09 21:10:02','2025-11-10 15:47:16',0),(23,6,NULL,3,3,1,0,'assda',NULL,NULL,'asd',5900,'2025-11-10 01:46:01','2025-11-09 22:46:01',0),(24,14,NULL,4,5,0,0,'cvbnc',NULL,NULL,'cnc',8960,'2025-11-10 03:44:06','2025-11-10 00:44:06',0),(25,15,NULL,6,6,0,1,'Quiero una terminacion alta por que me va a lastimas si no :(',NULL,NULL,'ninguna',11210,'2025-11-10 03:44:06','2025-11-10 00:44:06',0),(26,16,NULL,3,3,0,0,'gf',NULL,NULL,'fgds',5900,'2025-11-10 06:49:47','2025-11-10 03:49:47',0),(27,16,NULL,1,1,0,0,'asdas',NULL,NULL,'fffdfg',6300,'2025-11-10 06:49:47','2025-11-10 03:49:47',0),(28,16,NULL,4,5,0,0,'asdassd',NULL,NULL,'asdasd',8960,'2025-11-10 18:47:16','2025-11-10 15:47:16',0),(29,16,NULL,3,3,0,0,'sdafdsf',NULL,NULL,'sdf',5900,'2025-11-10 18:47:16','2025-11-10 15:47:16',0),(30,16,NULL,7,4,0,0,'asdasd',NULL,NULL,'asdasd',7475,'2025-11-10 18:47:16','2025-11-10 15:47:16',0);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_before_order_insert` BEFORE INSERT ON `orders` FOR EACH ROW BEGIN
    DECLARE v_base_price INT;
    DECLARE v_size_modifier FLOAT DEFAULT 0;
    DECLARE v_material_modifier FLOAT DEFAULT 0;
    DECLARE v_prosthesis_id INT UNSIGNED;
    DECLARE v_material_id INT UNSIGNED;

    -- Asignar IDs desde el nuevo registro
    SET v_prosthesis_id = NEW.prosthesis_id;
    SET v_material_id = NEW.material_id;

    -- Si hay prótesis asignada, calcular el precio
    IF v_prosthesis_id IS NOT NULL THEN
        
        -- Obtener el precio base de la prótesis
        SELECT base_price INTO v_base_price
        FROM prostheses
        WHERE id = v_prosthesis_id;

        -- Obtener el modificador del material (usando el ID)
        IF v_material_id IS NOT NULL THEN
            SELECT IFNULL(price_modifier, 0)
            INTO v_material_modifier
            FROM materials
            WHERE id = v_material_id;
        END IF;

        -- Obtener el modificador de tamaño (si existe relación con la prótesis)
        SELECT IFNULL(s.price_modifier, 0)
        INTO v_size_modifier
        FROM prosthesis_size ps
        INNER JOIN sizes s ON ps.size_id = s.id
        WHERE ps.prosthesis_id = v_prosthesis_id
        LIMIT 1;

        -- Calcular y asignar el precio total
        SET NEW.full_price = v_base_price +
                            (v_base_price * v_size_modifier) +
                            (v_base_price * v_material_modifier);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_order_insert` AFTER INSERT ON `orders` FOR EACH ROW BEGIN
    -- Insertar notificación automática para el usuario que creó la orden
    INSERT INTO notifications (
        user_id,
        order_id,
        message,
        type,
        current_stage,
        is_read
    )
    VALUES (
        NEW.user_id,           -- El usuario que creó la orden
        NEW.id,                -- El ID de la orden recién creada
        'Orden realizada',     -- Mensaje de notificación
        'aviso',               -- Tipo de notificación
        'en revision',         -- Estado actual
        0                      -- No leída (false)
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `doctor_id` int unsigned DEFAULT NULL,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `lastname` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `doctor_id_UNIQUE` (`doctor_id`),
  CONSTRAINT `fk_patient_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,2,'María','Fernández','2025-11-08 02:30:28','2025-11-07 23:30:28'),(2,6,'Diego','López','2025-11-08 02:30:28','2025-11-08 21:42:56'),(3,7,'Gabriela','Ríos','2025-11-09 03:41:40','2025-11-09 00:41:40'),(4,8,'Fernando','Paz','2025-11-09 03:41:40','2025-11-09 00:41:40');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prostheses`
--

DROP TABLE IF EXISTS `prostheses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prostheses` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `speciality_id` int unsigned NOT NULL,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `description` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `base_price` int NOT NULL,
  `img_url` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_prosthesis_speciality_idx` (`speciality_id`),
  CONSTRAINT `fk_prosthesis_speciality` FOREIGN KEY (`speciality_id`) REFERENCES `specialities` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prostheses`
--

LOCK TABLES `prostheses` WRITE;
/*!40000 ALTER TABLE `prostheses` DISABLE KEYS */;
INSERT INTO `prostheses` VALUES (1,1,'Muñequera ortopédica','Soporte para inmovilización parcial de muñeca',6000,'https://fastly.picsum.photos/id/9/5000/3269.jpg?hmac=cZKbaLeduq7rNB8X-bigYO8bvPIWtT-mh8GRXtU3vPc'),(2,2,'Férula de rodilla','Estabilización articular postoperatoria',12000,'https://fastly.picsum.photos/id/9/5000/3269.jpg?hmac=cZKbaLeduq7rNB8X-bigYO8bvPIWtT-mh8GRXtU3vPc'),(3,3,'Tobillera elástica','Sujeción flexible para esguinces leves',5000,'https://fastly.picsum.photos/id/9/5000/3269.jpg?hmac=cZKbaLeduq7rNB8X-bigYO8bvPIWtT-mh8GRXtU3vPc'),(4,4,'Férula de descarga nocturna','Protector dental para bruxismo',8000,'https://fastly.picsum.photos/id/9/5000/3269.jpg?hmac=cZKbaLeduq7rNB8X-bigYO8bvPIWtT-mh8GRXtU3vPc'),(5,4,'Retenedor ortodóncico','Mantenedor de posición post-tratamiento',7500,'https://fastly.picsum.photos/id/9/5000/3269.jpg?hmac=cZKbaLeduq7rNB8X-bigYO8bvPIWtT-mh8GRXtU3vPc'),(6,5,'Órtesis para mano','Soporte funcional para terapia ocupacional',9500,'https://fastly.picsum.photos/id/9/5000/3269.jpg?hmac=cZKbaLeduq7rNB8X-bigYO8bvPIWtT-mh8GRXtU3vPc'),(7,5,'Adaptador ergonómico de agarre','Dispositivo de asistencia para actividades diarias',6500,'https://fastly.picsum.photos/id/9/5000/3269.jpg?hmac=cZKbaLeduq7rNB8X-bigYO8bvPIWtT-mh8GRXtU3vPc');
/*!40000 ALTER TABLE `prostheses` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trigger_after_prosthesis_price_update` AFTER UPDATE ON `prostheses` FOR EACH ROW BEGIN
    -- Variable para recorrer las órdenes
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_order_id INT UNSIGNED;
    
    -- Cursor para obtener todas las órdenes que usan esta prótesis
    DECLARE order_cursor CURSOR FOR 
        SELECT id 
        FROM orders 
        WHERE prosthesis_id = NEW.id;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Solo ejecutar si el base_price cambió
    IF OLD.base_price <> NEW.base_price THEN
        
        -- Abrir cursor
        OPEN order_cursor;
        
        -- Loop para recalcular precio de cada orden
        read_loop: LOOP
            FETCH order_cursor INTO v_order_id;
            
            IF done THEN
                LEAVE read_loop;
            END IF;
            
            -- Llamar al stored procedure para recalcular el precio
            CALL sp_calculate_full_price_silent(v_order_id);

            
        END LOOP;
        
        -- Cerrar cursor
        CLOSE order_cursor;
        
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `prosthesis_material`
--

DROP TABLE IF EXISTS `prosthesis_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prosthesis_material` (
  `prosthesis_id` int unsigned NOT NULL,
  `material_id` int unsigned NOT NULL,
  PRIMARY KEY (`prosthesis_id`,`material_id`),
  KEY `fk_prosthesis_material_idx` (`material_id`),
  CONSTRAINT `fk_material_prosthesis` FOREIGN KEY (`prosthesis_id`) REFERENCES `prostheses` (`id`),
  CONSTRAINT `fk_prosthesis_material` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prosthesis_material`
--

LOCK TABLES `prosthesis_material` WRITE;
/*!40000 ALTER TABLE `prosthesis_material` DISABLE KEYS */;
INSERT INTO `prosthesis_material` VALUES (1,1),(7,1),(2,2),(3,3),(1,4),(7,4),(4,5),(5,5),(6,6);
/*!40000 ALTER TABLE `prosthesis_material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prosthesis_size`
--

DROP TABLE IF EXISTS `prosthesis_size`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prosthesis_size` (
  `prosthesis_id` int unsigned NOT NULL,
  `size_id` int unsigned NOT NULL,
  PRIMARY KEY (`prosthesis_id`,`size_id`),
  KEY `fk_prosthesis_size_idx` (`size_id`),
  CONSTRAINT `fk_prosthesis_size` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`),
  CONSTRAINT `fk_size_prosthesis` FOREIGN KEY (`prosthesis_id`) REFERENCES `prostheses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prosthesis_size`
--

LOCK TABLES `prosthesis_size` WRITE;
/*!40000 ALTER TABLE `prosthesis_size` DISABLE KEYS */;
INSERT INTO `prosthesis_size` VALUES (1,1),(4,1),(5,1),(6,1),(7,1),(1,2),(3,2),(4,2),(5,2),(6,2),(2,3),(6,3);
/*!40000 ALTER TABLE `prosthesis_size` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sizes`
--

DROP TABLE IF EXISTS `sizes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sizes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `price_modifier` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sizes`
--

LOCK TABLES `sizes` WRITE;
/*!40000 ALTER TABLE `sizes` DISABLE KEYS */;
INSERT INTO `sizes` VALUES (1,'Pequeño',0),(2,'Mediano',0.1),(3,'Grande',0.2);
/*!40000 ALTER TABLE `sizes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specialities`
--

DROP TABLE IF EXISTS `specialities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specialities` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specialities`
--

LOCK TABLES `specialities` WRITE;
/*!40000 ALTER TABLE `specialities` DISABLE KEYS */;
INSERT INTO `specialities` VALUES (1,'Traumatología'),(2,'Ortopedia'),(3,'Rehabilitación'),(4,'Odontología'),(5,'Terapia Ocupacional');
/*!40000 ALTER TABLE `specialities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `lastname` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `user_type` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@sigpe.com','Admin','General','hashed_admin_pass','admin',1,0,'2025-11-08 02:29:53','2025-11-07 23:29:53'),(2,'doctor1@hospital.com','Laura','Martínez','hashed_pass1','doctor',1,0,'2025-11-08 02:29:53','2025-11-07 23:29:53'),(3,'doctor2@hospital.com','Pablo','Sosa','hashed_pass2','doctor',1,0,'2025-11-08 02:29:53','2025-11-07 23:29:53'),(4,'tecnico1@sigpe.com','Carla','López','hashed_pass3','tecnico',1,0,'2025-11-08 02:29:53','2025-11-10 15:18:14'),(5,'paciente1@sigpe.com','Sofía','Gómez','hashed_pass4','patient',1,0,'2025-11-08 02:29:53','2025-11-07 23:29:53'),(6,'user@example.com','string','string','$2b$12$bCSv42r1XRE8nKunzuPbTOYAwzUU2PgE251FN9zMxkES6XAFqJWoa','doctor',1,0,'2025-11-08 07:23:23','2025-11-09 15:12:50'),(7,'odontologo1@clinica.com','Roberto','Vargas','$2b$12$abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx1234yzab5678','doctor',1,0,'2025-11-09 03:41:40','2025-11-09 00:41:40'),(8,'terapeuta1@centro.com','Ana','Morales','$2b$12$wxyz9876dcba5432ponm1098lkji7654hgfe3210tsrq6789mnop1234','doctor',1,0,'2025-11-09 03:41:40','2025-11-09 00:41:40'),(9,'tecnico2@sigpe.com','Miguel','Castro','$2b$12$qwer1234tyui5678asdf9012ghjk3456zxcv7890bnml1234poiu5678','tecnico',1,0,'2025-11-09 03:41:40','2025-11-10 15:18:14'),(10,'yo@example.com','string','string','$2b$12$6o7RjAtK0K06ltOnw8zQCeraPXGr3d3wivm9zoj2234xURKhgcjEi','tecnico',1,0,'2025-11-09 21:10:02','2025-11-09 21:24:43'),(11,'assdadadad@example.com','string','string','$2b$12$s/PWtzW/i4qvnoGK.2HO7OwntedIVZCUd8Jy5120U0RAWpMWNuJ.G','cliente_particular',1,0,'2025-11-09 23:14:42','2025-11-09 20:14:42'),(12,'assdadasd@asdad.com','aldja123','adlkasd1230203','$2b$12$hUDk0xWxUA/FFwwiykwwA.k5rMi4AKOShyyA5vWx0lyiAbLb8kAoq','cliente_particular',1,0,'2025-11-09 23:14:42','2025-11-09 20:14:42'),(13,'asdads@hot.com','asd','sada','$2b$12$VY9GnivggOS4sS7C7Wso9.izDDapqP7vqymF/bgN5T4dD5RhOKmzy','cliente_particular',1,0,'2025-11-10 01:46:01','2025-11-09 22:46:01'),(14,'aksjsdhkashd@askd.com','babau','perro','$2b$12$48rcTDxudeeXR0oqtbOOD.niI1X3mE5TchbyY39zTFjwxNDWmAobG','cliente_particular',1,0,'2025-11-10 03:44:06','2025-11-10 00:44:06'),(15,'hola@hotmail.com','jorge','padula','$2b$12$I3bLj70amBfXbaYUyk2C1.FY/CkPHX1tU9i3Oq4r2AUVk40QAnyvG','cliente_particular',1,0,'2025-11-10 03:44:06','2025-11-10 00:44:06'),(16,'sfssdfsdf@fgfdg.com','ssssssssss','ssssssss','$2b$12$JbzWpJ7v7HRakR64hJ3cJuYJDq8ZPmP.6FW7VDR3ulBRBMHSSwAKW','cliente_particular',1,0,'2025-11-10 06:49:47','2025-11-10 03:49:47');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'sigpe_test'
--

--
-- Dumping routines for database 'sigpe_test'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_calculate_full_price` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_calculate_full_price`(IN p_order_id INT UNSIGNED)
BEGIN
    DECLARE v_base_price INT;
    DECLARE v_size_modifier FLOAT DEFAULT 0;
    DECLARE v_material_modifier FLOAT DEFAULT 0;
    DECLARE v_full_price FLOAT;
    DECLARE v_prosthesis_id INT UNSIGNED;
    DECLARE v_material_id INT UNSIGNED;

    -- Obtener IDs de prótesis y material desde la orden
    SELECT prosthesis_id, material_id
    INTO v_prosthesis_id, v_material_id
    FROM orders
    WHERE id = p_order_id;

    -- Verificar que haya prótesis asignada
    IF v_prosthesis_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La orden no tiene una prótesis asignada';
    END IF;

    -- Obtener el precio base de la prótesis
    SELECT base_price
    INTO v_base_price
    FROM prostheses
    WHERE id = v_prosthesis_id;

    -- Obtener el modificador del material (si existe)
    IF v_material_id IS NOT NULL THEN
        SELECT IFNULL(price_modifier, 0)
        INTO v_material_modifier
        FROM materials
        WHERE id = v_material_id;
    END IF;

    -- Obtener el modificador de tamaño (si existe relación)
    SELECT IFNULL(s.price_modifier, 0)
    INTO v_size_modifier
    FROM prosthesis_size ps
    INNER JOIN sizes s ON ps.size_id = s.id
    WHERE ps.prosthesis_id = v_prosthesis_id
    LIMIT 1;

    -- Calcular precio total
    SET v_full_price = v_base_price +
                       (v_base_price * v_size_modifier) +
                       (v_base_price * v_material_modifier);

    -- Actualizar precio total en la orden
    UPDATE orders
    SET full_price = v_full_price
    WHERE id = p_order_id;

    -- Retornar el precio calculado
    SELECT v_full_price AS calculated_price;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_calculate_full_price_silent` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_calculate_full_price_silent`(
    IN p_order_id INT UNSIGNED
)
proc_label: BEGIN
    DECLARE v_base_price INT;
    DECLARE v_size_modifier FLOAT DEFAULT 0;
    DECLARE v_material_modifier FLOAT DEFAULT 0;
    DECLARE v_full_price FLOAT;
    DECLARE v_prosthesis_id INT UNSIGNED;
    DECLARE v_material_id INT UNSIGNED;

    -- Obtener prosthesis_id y material_id de la orden
    SELECT prosthesis_id, material_id
    INTO v_prosthesis_id, v_material_id
    FROM orders
    WHERE id = p_order_id;

    -- Si no hay prótesis asignada, salir sin error
    IF v_prosthesis_id IS NULL THEN
        LEAVE proc_label;
    END IF;

    -- Obtener el precio base de la prótesis
    SELECT base_price
    INTO v_base_price
    FROM prostheses
    WHERE id = v_prosthesis_id;

    -- Obtener el modificador del material
    IF v_material_id IS NOT NULL THEN
        SELECT IFNULL(price_modifier, 0)
        INTO v_material_modifier
        FROM materials
        WHERE id = v_material_id;
    END IF;

    -- Obtener el modificador de tamaño (si existe relación)
    SELECT IFNULL(s.price_modifier, 0)
    INTO v_size_modifier
    FROM prosthesis_size ps
    INNER JOIN sizes s ON ps.size_id = s.id
    WHERE ps.prosthesis_id = v_prosthesis_id
    LIMIT 1;

    -- Calcular el precio total
    SET v_full_price = v_base_price +
                       (v_base_price * v_size_modifier) +
                       (v_base_price * v_material_modifier);

    -- Actualizar el precio total en la orden (sin retornar nada)
    UPDATE orders
    SET full_price = v_full_price
    WHERE id = p_order_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-10 15:19:06
