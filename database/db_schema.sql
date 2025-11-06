-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema sigpe_test
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema sigpe_test
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `sigpe_test` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci ;
USE `sigpe_test` ;

-- -----------------------------------------------------
-- Table `sigpe_test`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sigpe_test`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_spanish_ci' NOT NULL,
  `name` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_spanish_ci' NULL DEFAULT NULL,
  `lastname` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_spanish_ci' NULL DEFAULT NULL,
  `password` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_spanish_ci' NOT NULL,
  `user_type` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_spanish_ci' NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT '1',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

CREATE UNIQUE INDEX `id` ON `sigpe_test`.`users` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `sigpe_test`.`orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sigpe_test`.`orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `technician_id` INT NULL DEFAULT NULL,
  `is_medical` TINYINT NOT NULL DEFAULT '0',
  `has_design` TINYINT NOT NULL DEFAULT '0',
  `processing_level` VARCHAR(128) NULL DEFAULT NULL,
  `current_stage` VARCHAR(128) NULL DEFAULT NULL,
  `meeting_date` DATETIME NULL DEFAULT NULL,
  `specification` VARCHAR(1024) NULL DEFAULT NULL,
  `print_type` VARCHAR(128) NOT NULL,
  `printing_material` VARCHAR(128) NOT NULL COMMENT 'aca lo ideal creo que seria poner directamente el filamento a usar junto con su tipo y que la logica de negocio para elegirlo este en el frontend',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_order_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `sigpe_test`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_spanish2_ci;

CREATE INDEX `id` ON `sigpe_test`.`orders` (`id` ASC) VISIBLE;

CREATE INDEX `user_id_idx` ON `sigpe_test`.`orders` (`user_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `sigpe_test`.`3d_models`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sigpe_test`.`3d_models` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT UNSIGNED NOT NULL,
  `file_name` VARCHAR(128) NULL DEFAULT NULL,
  `file_format` VARCHAR(45) NULL DEFAULT NULL,
  `file_size` VARCHAR(45) NULL DEFAULT NULL,
  `file_path` VARCHAR(128) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_model_order`
    FOREIGN KEY (`order_id`)
    REFERENCES `sigpe_test`.`orders` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `sigpe_test`.`3d_models` (`id` ASC) VISIBLE;

CREATE INDEX `fk_model_order_idx` ON `sigpe_test`.`3d_models` (`order_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `sigpe_test`.`doctors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sigpe_test`.`doctors` (
  `user_id` INT UNSIGNED NOT NULL,
  `license_number` VARCHAR(45) NULL DEFAULT NULL,
  `institution_name` VARCHAR(128) NULL DEFAULT NULL,
  `speciality` VARCHAR(128) NULL DEFAULT NULL,
  `is_verified` TINYINT NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_doctor_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `sigpe_test`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_spanish_ci;


-- -----------------------------------------------------
-- Table `sigpe_test`.`patients`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sigpe_test`.`patients` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `doctor_id` INT UNSIGNED NULL DEFAULT NULL,
  `name` VARCHAR(128) NULL DEFAULT NULL,
  `lastname` VARCHAR(128) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_patient_doctor`
    FOREIGN KEY (`doctor_id`)
    REFERENCES `sigpe_test`.`doctors` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `sigpe_test`.`patients` (`id` ASC) VISIBLE;

CREATE UNIQUE INDEX `doctor_id_UNIQUE` ON `sigpe_test`.`patients` (`doctor_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `sigpe_test`.`medical_orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sigpe_test`.`medical_orders` (
  `order_id` INT UNSIGNED NOT NULL,
  `patient_id` INT UNSIGNED NOT NULL,
  `urgency_level` VARCHAR(45) NOT NULL DEFAULT 'Estándar' COMMENT 'tipos posibles: \'Estándar\', \'Prioritario\', \'Urgente\'',
  `pathology` VARCHAR(45) NULL DEFAULT NULL,
  `medical_observations` VARCHAR(1024) NULL DEFAULT NULL,
  `priority_level` INT NULL DEFAULT NULL COMMENT 'se va a encargar de ordenar por nivel de prioridad segun algun usuario lo determine',
  PRIMARY KEY (`order_id`, `patient_id`),
  CONSTRAINT `fk_medical_order_order`
    FOREIGN KEY (`order_id`)
    REFERENCES `sigpe_test`.`orders` (`id`),
  CONSTRAINT `fk_medical_patient`
    FOREIGN KEY (`patient_id`)
    REFERENCES `sigpe_test`.`patients` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

CREATE INDEX `fk_medical_patient_idx` ON `sigpe_test`.`medical_orders` (`patient_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `sigpe_test`.`notifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sigpe_test`.`notifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `order_id` INT UNSIGNED NOT NULL,
  `message` VARCHAR(1024) NULL DEFAULT NULL,
  `is_read` TINYINT NOT NULL DEFAULT '0',
  `type` VARCHAR(45) NULL DEFAULT NULL,
  `current_stage` VARCHAR(128) NULL DEFAULT 'null',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_notification_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `sigpe_test`.`users` (`id`),
  CONSTRAINT `fk_notifications_order`
    FOREIGN KEY (`order_id`)
    REFERENCES `sigpe_test`.`orders` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `sigpe_test`.`notifications` (`id` ASC) VISIBLE;

CREATE INDEX `fk_notification_user_idx` ON `sigpe_test`.`notifications` (`user_id` ASC) VISIBLE;

CREATE INDEX `fk_notifications_order_idx` ON `sigpe_test`.`notifications` (`order_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `sigpe_test`.`observations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sigpe_test`.`observations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NULL DEFAULT NULL,
  `order_id` INT UNSIGNED NULL DEFAULT NULL,
  `type` VARCHAR(45) NULL DEFAULT NULL,
  `comment` VARCHAR(1024) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_observation_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `sigpe_test`.`users` (`id`),
  CONSTRAINT `fk_observations_order`
    FOREIGN KEY (`order_id`)
    REFERENCES `sigpe_test`.`orders` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `sigpe_test`.`observations` (`id` ASC) VISIBLE;

CREATE INDEX `fk_observation_user_idx` ON `sigpe_test`.`observations` (`user_id` ASC) VISIBLE;

CREATE INDEX `fk_observations_order_idx` ON `sigpe_test`.`observations` (`order_id` ASC) VISIBLE;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
