-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: localhost    Database: ecom_tinybee
-- ------------------------------------------------------
-- Server version	8.0.23

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
-- Table structure for table `auth_token`
--

DROP TABLE IF EXISTS `auth_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `type` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_token`
--

LOCK TABLES `auth_token` WRITE;
/*!40000 ALTER TABLE `auth_token` DISABLE KEYS */;
INSERT INTO `auth_token` VALUES (1,'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaXYyLnNoaXByb2NrZXQuaW4vdjEvZXh0ZXJuYWwvYXV0aC9sb2dpbiIsImlhdCI6MTY5MDMwMzc4MSwiZXhwIjoxNjkxMTY3NzgxLCJuYmYiOjE2OTAzMDM3ODEsImp0aSI6InZkTm9YZ0V2NVNka0JLWHEiLCJzdWIiOjMyODg4NTIsInBydiI6IjA1YmI2NjBmNjdjYWM3NDVmN2IzZGExZWVmMTk3MTk1YTIxMWU2ZDkifQ.S9l8sa8QaXg2_A523FX9lj-eRXP3QeneaqrVeGwfkx4','shiprocket','2023-07-26 16:33:26','2023-07-26 16:33:26');
/*!40000 ALTER TABLE `auth_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_row_id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_code` varchar(45) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `quantity` int DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`cart_row_id`),
  KEY `fk_cart_id_idx` (`cart_id`),
  CONSTRAINT `fk_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `user_cart` (`cart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='	';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (2,1,'TE0100',229,3,'2023-07-08 17:46:00','2023-07-08 17:46:00');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `coupon_code` varchar(45) NOT NULL,
  `user_id` int NOT NULL,
  `discount` int DEFAULT NULL,
  `discount_type` enum('P','N') DEFAULT 'P',
  `count` int DEFAULT '1',
  `expires_at` timestamp NULL DEFAULT NULL,
  `max_discount` int DEFAULT NULL,
  `min_order_value` int DEFAULT NULL,
  `redeem_items` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`coupon_code`,`user_id`),
  KEY `fk_user_id_idx` (`user_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_address`
--

DROP TABLE IF EXISTS `delivery_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_address` (
  `delivery_address_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `house_no` varchar(45) DEFAULT NULL,
  `street1` varchar(100) DEFAULT NULL,
  `street2` varchar(100) DEFAULT NULL,
  `landmark` varchar(100) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `district` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `zipcode` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `one_time_use` tinyint(1) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`delivery_address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_address`
--

LOCK TABLES `delivery_address` WRITE;
/*!40000 ALTER TABLE `delivery_address` DISABLE KEYS */;
INSERT INTO `delivery_address` VALUES (1,2,'Bhavik','Mojidra','B-4','street1','street2','some landmark','x city','y district','Gujarat','123456','Somewhere on earth',NULL,1,0),(2,2,'Bhavik','Mojidra','B-4','street1','street2','some landmark','x city','y district','Gujarat','123456','Somewhere on earth',NULL,1,0),(3,2,'Bhavik','Mojidra','B-4','street1','street2','some landmark','Z city','Z district','Gujarat','123456','Somewhere on earth',NULL,0,0),(4,2,'Bhavik','Mojidra','B-4','street1','street2','some landmark','Z city','Z district','Gujarat','567890','Somewhere on earth',NULL,0,0),(5,2,'Bhavik','Mojidra','B-4','street1','street2','some landmark','Z city','Z district','Gujarat','567890','Somewhere on earth',NULL,0,0),(6,2,'Bhavik','Mojidra','B-4','street1','street2','some landmark','Z city','Z district','Gujarat','567890','Somewhere on earth',NULL,0,1),(7,3,'Bhavik','Mojidra','B-4','street1','street2','some landmark','Z city','Z district','Gujarat','567890','Somewhere on earth',NULL,0,0);
/*!40000 ALTER TABLE `delivery_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_row`
--

DROP TABLE IF EXISTS `order_row`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_row` (
  `order_row_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_code` varchar(45) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` float DEFAULT NULL,
  PRIMARY KEY (`order_row_id`),
  KEY `oder_id_fk_idx` (`order_id`),
  CONSTRAINT `oder_id_fk` FOREIGN KEY (`order_id`) REFERENCES `user_orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_row`
--

LOCK TABLES `order_row` WRITE;
/*!40000 ALTER TABLE `order_row` DISABLE KEYS */;
INSERT INTO `order_row` VALUES (1,2,'TE0100',1,229),(2,2,'TE0200',1,229),(3,3,'TE0100',1,229),(4,3,'TE0200',1,229),(5,4,'TE0100',1,229),(6,5,'TE0100',1,229),(7,6,'TE0100',1,229);
/*!40000 ALTER TABLE `order_row` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `receipt_id` varchar(50) NOT NULL,
  `amount` int DEFAULT NULL,
  `currency` varchar(45) DEFAULT NULL,
  `notes` text,
  `razor_order_id` varchar(50) DEFAULT NULL,
  `razor_payment_id` varchar(50) DEFAULT NULL,
  `razor_signature` varchar(255) DEFAULT NULL,
  `payment_status` tinyint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`receipt_id`),
  KEY `index_order_od` (`razor_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES ('013f7b0b-71cf-44c8-89e8-26f573598ccb',120000,'INR','{\"TE0200\":1}','order_Lqn7R2iFSbFwb3',NULL,NULL,0,'2023-05-17 16:11:49',2,NULL),('4f516244-5ae9-4054-bc49-cbcbca791e00',45800,'INR','{\"TE0100\":1,\"TE0200\":1}','test_4f516244-5ae9-4054-bc49-cbcbca791e00',NULL,NULL,0,'2023-06-23 16:13:43',2,NULL),('77a38858-6a3c-4742-867b-fd990eaa40e6',45800,'INR','{\"TE0100\":1,\"TE0200\":1}','test_77a38858-6a3c-4742-867b-fd990eaa40e6',NULL,NULL,0,'2023-06-23 16:02:45',2,NULL),('7c1bb6c4-32c3-47b3-899f-d2d82a26d488',120000,'INR','{\"TE0200\":1}','order_Lqn4GicZw46plZ',NULL,NULL,0,'2023-05-17 16:08:49',2,NULL),('8aea4295-7451-439b-b6e3-9b4118ddcebb',22900,'INR','{\"TE0100\":1}','test_8aea4295-7451-439b-b6e3-9b4118ddcebb',NULL,NULL,0,'2023-07-08 12:16:18',2,NULL),('c5d54aee-aa95-43f5-bc11-98a80f9978e1',22900,'INR','{\"TE0100\":1}','test_c5d54aee-aa95-43f5-bc11-98a80f9978e1',NULL,NULL,0,'2023-07-08 12:15:39',2,NULL),('daea901f-e861-42e2-9ce0-ae9e77fd84b4',45800,'INR','{\"TE0100\":1,\"TE0200\":1}','test_daea901f-e861-42e2-9ce0-ae9e77fd84b4',NULL,NULL,0,'2023-06-23 16:09:15',2,NULL),('e5537b22-f2f5-42d5-9800-e885a840cb21',22900,'INR','{\"TE0100\":1}','test_e5537b22-f2f5-42d5-9800-e885a840cb21',NULL,NULL,0,'2023-07-08 12:16:07',2,NULL);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `price_update_history`
--

DROP TABLE IF EXISTS `price_update_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `price_update_history` (
  `product_code` varchar(45) NOT NULL,
  `old_price` int DEFAULT NULL,
  `new_price` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `price_update_history`
--

LOCK TABLES `price_update_history` WRITE;
/*!40000 ALTER TABLE `price_update_history` DISABLE KEYS */;
INSERT INTO `price_update_history` VALUES ('TE0200',1289,1280,'2022-12-30 17:45:10'),('TE0200',1280,1200,'2022-12-30 17:45:53'),('TE0100',500,500,'2023-05-24 17:29:44'),('TE0100',500,500,'2023-05-24 17:31:08'),('TE0100',500,500,'2023-05-24 17:35:40'),('TE0100',500,500,'2023-05-24 17:36:27'),('TE0100',500,500,'2023-05-24 17:37:09'),('TE0100',500,500,'2023-05-24 17:37:21'),('TE0100',500,500,'2023-05-24 17:37:28');
/*!40000 ALTER TABLE `price_update_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `image` text,
  `seq` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (4,2,'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+NTZy51f/kfjPq19da6bofjPoJ64qdzU5FFS6a8y50rG7Q2Yt4QTHCR9tNrs5tJXlP2VtfyOxn0E9dfhS/kdjPop6w+Fa7atc287sa+ErFcUbW4jeGY8VnrICgKNAAB2DKlLT1/f2VoB0Mxf0Lfr/ZXR6GYv6Nv1z8KzbmpMwVpFakP3BZdE3G30JR9JgEEHgRxFTU2jd4lT/pj31dfkRi/8r1yO5a6/IbFc7Q/1H+WrGC4aIEqfaaY/cFVJtM8VB7DHxrm/it8DIADPX31c/kNivpWvWb4V0vQXE/TtelvhUu9pc3CZj4INzTP7go3RG3OMtRw3m/dI59den1mOjHRk4ZmuXHDuRujdBAUanXUnL0VpxWq2pljIdqltzUD3yEtFFFaFQikilooQikilooQikilooQiiiihCSKIpaKEIooooQiiiihCKKKKEIooooQkiloooQiiiihCKKKKEIooooQiiiuGaI6zHsJoQu6KKKEIooooQiiiihCKKKKEIooooQiiiihCKKKKEIooooQiiiihCKKKKEIooooQiiiihCKKKKEIooooQiiiihCKbuar2+40UUITlFFFCEUUUUIX/2Q==',0),(5,2,'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',1);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_code` varchar(45) NOT NULL,
  `product_category` varchar(45) DEFAULT NULL,
  `product_name` varchar(45) NOT NULL,
  `product_desc` text,
  `price` float DEFAULT NULL,
  `product_dimension` varchar(45) DEFAULT NULL,
  `age_group` varchar(45) DEFAULT NULL,
  `product_material` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_code_UNIQUE` (`product_code`),
  UNIQUE KEY `productname_UNIQUE` (`product_name`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'LE0100','Learning & Education','Classic Wooden Alphabet Puzzle','A, B, C, D, E, F, G… Classic Wooden Alphabet Puzzle is designed as an educational tool which encourages children to learn the alphabets and take their first step towards spelling, reading and writing. With no sharp edges, these multi-colored alphabet letters are easy for little hands to hold. Designed for maximum child safety, this puzzle is made of non-toxic water based paints which are 100% child safe. The sturdy design of this puzzle makes it a toy for life. Classic Wooden Alphabet Puzzle is great for enriching a toddler’s cognitive skills, fine motor skills & visual perception skills.\nAwesome gift for a preschooler. They will really love playing with this puzzle',699,'27 × 1 × 27 cm','3Y+','wood'),(2,'TE0100','Teethers','Elephant Wooden Teether','How cute is our little Elephant Wooden Teether! This elephant shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums.\nBring home this TinyBee teether and watch your child indulge in it playfully.',229,'9 × 1 × 7.2 cm','4M+','wood'),(3,'TE0200','Teethers','Hippo Wooden Teether','How cute is our little Hippo Wooden Teether! This hippo shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums.\nBring home this TinyBee teether and watch your child indulge in it playfully.',229,'10 × 1 × 6.4 cm','4M+','wood'),(4,'TE0300','Teethers','Koala Wooden Teether','How cute is our little Koala Wooden Teether! This koala shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums.\nBring home this TinyBee teether and watch your child indulge in it playfully.',229,'8 × 1 × 9 cm','4M+','wood'),(5,'TE0400','Teethers','Panda Wooden Teether','How cute is our little Panda Wooden Teether! This panda shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums.\nBring home this TinyBee teether and watch your child indulge in it playfully.',229,'7.6 × 1 × 9 cm','4M+','wood'),(6,'TE0500','Teethers','Dove Wooden Teether','How cute is our little Dove Wooden Teether! This dove shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums.\nBring home this TinyBee teether and watch your child indulge in it playfully.',229,'9.8 × 1 × 7.4 cm','4M+','wood'),(7,'TE0600','Teethers','Owl Wooden Teether','How cute is our little Owl Wooden Teether! This owl shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums.\nBring home this TinyBee teether and watch your child indulge in it playfully.',229,'7.8 × 1 × 9 cm','4M+','wood'),(8,'TE0700','Teethers','Whale  Wooden Teether','How cute is our little Whale Wooden Teether! This whale shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums.\nBring home this TinyBee teether and watch your child indulge in it playfully.',229,'11.2 × 1 × 6.2 cm','4M+','wood'),(9,'TE0800','Teethers','Nemo Fish Wooden Teether','How cute is our little Nemo Fish Wooden Teether! This nemo fish shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums.\nBring home this TinyBee teether and watch your child indulge in it playfully.',229,'9 × 1 × 5.6 cm','4M+','wood'),(10,'TE0900','Teethers','Star Wooden Teether','This star shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums.\nBring home this TinyBee teether and watch your child indulge in it playfully.',229,'9 × 1 × 9 cm','4M+','wood'),(11,'TE1000','Teethers','Circular Wooden Teether','This circle shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums.\nBring home this TinyBee teether and watch your child indulge in it playfully.',229,'9 × 1 × 9 cm','4M+','wood'),(12,'TE1100','Teethers','Square Wooden Teether','This square shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums.\nBring home this TinyBee teether and watch your child indulge in it playfully.',229,'9 × 1 × 9 cm','4M+','wood'),(13,'TE1200','Teethers','Triangular Wooden Teether','This triangle shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums.ing home this TinyBee teether and watch your child indulge in it playfully.',229,'9 × 1 × 8.5 cm','4M+','wood'),(14,'TE1300','Teethers','Yo-Yo Wooden Teether','How cute is our little Yo-Yo Wooden Teether! This Yo-Yo shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums. \nBring home this TinyBee teether and watch your child indulge in it playfully.',229,'8 × 1 × 9 cm','4M+','wood'),(15,'TE1400','Teethers','Bunny Wooden Teether','How cute is our little Bunny Wooden Teether! This bunny shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums. \nBring home this TinyBee teether and watch your child indulge in it playfully.',229,'6.8 × 1 × 9 cm','4M+','wood'),(16,'TE1500','Teethers','Hedgehog Wooden Teether','How cute is our little Hedgehog Wooden Teether! This hedgehog shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums. \nBring home this TinyBee teether and watch your child indulge in it playfully.',229,'9 × 1 × 6.5 cm','4M+','wood'),(17,'TE1600','Teethers','Rocket Wooden Teether','How cute is our little Rocket Wooden Teether! This rocket shaped beech wood teether is expertly designed so that your baby can easily wrap their tiny fingers around it. Your child may have sore or tender gums when their teeth begin to erupt. This teether is the best to soothe those aching gums as well as to entertain your little ones. It also helps to stimulate baby’s sense of feel & touch and to develop hand-eye coordination as your baby learn to bring the teether to their mouth. The Beech wood used for creating this teether is natural and non-toxic, so you can rest assured knowing that its super safe for your little one and their tender gums. \nBring home this TinyBee teether and watch your child indulge in it playfully.',229,'6.8 × 1 × 10 cm','4M+','wood'),(18,'PA0101','Push & Pull','Classic Sports Car','Vroom! Vroom! Make way for TinyBee’s Classic Sports Car which makes your child’s world full of imagination and creative play!\nThis fascinating miniature vehicle features bright colors, attractive patterns and whimsical designs to make your child wonder and spark their imagination. This wheeling fun toy is a perfect playmate for your child to race around the house, create stories and pretend play. This easy to grip vehicle will hone your child’s cognitive skills, gross motor skills and spatial awareness. Designed for maximum child safety, this toy is made of natural wood & non-toxic water-based paints which are 100% child safe. The sturdy design of this toy makes it durable enough to keep rolling for generations of play. \nA wonderful addition to your little ones toy collection! Kids will have a rocking good time with this adorable push along miniature vehicle.',549,'14 × 4.4 × 5 cm','18M+','wood'),(19,'PA0201','Push & Pull','Vintage Jeep','Vroom! Vroom! Make way for TinyBee’s Vintage Jeep which makes your child’s world full of imagination and creative play!\nThis fascinating miniature vehicle features bright colors, attractive patterns and whimsical designs to make your child wonder and spark their imagination. This wheeling fun toy is a perfect playmate for your child to race around the house, create stories and pretend play. This easy to grip vehicle will hone your child’s cognitive skills, gross motor skills and spatial awareness. Designed for maximum child safety, this toy is made of natural wood & non-toxic water-based paints which are 100% child safe. The sturdy design of this toy makes it durable enough to keep rolling for generations of play.\nA wonderful addition to your little ones toy collection! Kids will have a rocking good time with this adorable push along miniature vehicle.',549,'12 × 4.4 × 6.4 cm','18M+','wood'),(20,'PA0301','Push & Pull','Beetle Car','Vroom! Vroom! Make way for TinyBee’s Beetle Car which makes your child’s world full of imagination and creative play!\nThis fascinating miniature vehicle features bright colors, attractive patterns and whimsical designs to make your child wonder and spark their imagination. This wheeling fun toy is a perfect playmate for your child to race around the house, create stories and pretend play. This easy to grip vehicle will hone your child’s cognitive skills, gross motor skills and spatial awareness. Designed for maximum child safety, this toy is made of natural wood & non-toxic water-based paints which are 100% child safe. The sturdy design of this toy makes it durable enough to keep rolling for generations of play.\nA wonderful addition to your little ones toy collection! Kids will have a rocking good time with this adorable push along miniature vehicle.',549,'12 × 4.4 × 7.4 cm','18M+','wood'),(21,'PA0402','Push & Pull','E-Bike_Pink','Peep! Peep! Make way for TinyBee’s E-Bike which makes your child’s world full of imagination and creative play!\nThis fascinating miniature vehicle features bright colors, attractive patterns and whimsical designs to make your child wonder and spark their imagination. This wheeling fun toy is a perfect playmate for your child to race around the house, create stories and pretend play. This easy to grip vehicle will hone your child’s cognitive skills, gross motor skills and spatial awareness. Designed for maximum child safety, this toy is made of natural wood & non-toxic water-based paints which are 100% child safe. The sturdy design of this toy makes it durable enough to keep rolling for generations of play.\nA wonderful addition to your little ones toy collection! Kids will have a rocking good time with this adorable push along miniature vehicle.',549,'12 × 4.4 × 7.2 cm','18M+','wood'),(22,'PA0403','Push & Pull','E-Bike_Green','Peep! Peep! Make way for TinyBee’s E-Bike which makes your child’s world full of imagination and creative play!\nThis fascinating miniature vehicle features bright colors, attractive patterns and whimsical designs to make your child wonder and spark their imagination. This wheeling fun toy is a perfect playmate for your child to race around the house, create stories and pretend play. This easy to grip vehicle will hone your child’s cognitive skills, gross motor skills and spatial awareness. Designed for maximum child safety, this toy is made of natural wood & non-toxic water-based paints which are 100% child safe. The sturdy design of this toy makes it durable enough to keep rolling for generations of play.\nA wonderful addition to your little ones toy collection! Kids will have a rocking good time with this adorable push along miniature vehicle.',549,'12 × 4.4 × 7.2 cm','18M+','wood'),(23,'PA0501','Push & Pull','Golf Cart','Peep! Peep! Make way for TinyBee’s Golf Cart which makes your child’s world full of imagination and creative play!\nThis fascinating miniature vehicle features bright colors, attractive patterns and whimsical designs to make your child wonder and spark their imagination. This wheeling fun toy is a perfect playmate for your child to race around the house, create stories and pretend play. This easy to grip vehicle will hone your child’s cognitive skills, gross motor skills and spatial awareness. Designed for maximum child safety, this toy is made of natural wood & non-toxic water-based paints which are 100% child safe. The sturdy design of this toy makes it durable enough to keep rolling for generations of play.\nA wonderful addition to your little ones toy collection! Kids will have a rocking good time with this adorable push along miniature vehicle.',549,'12 × 4.4 × 7.8 cm','18M+','wood'),(24,'PA0601','Push & Pull','School Bus','Peep! Peep! Make way for TinyBee’s School Bus which makes your child’s world full of imagination and creative play!\nThis fascinating miniature vehicle features bright colors, attractive patterns and whimsical designs to make your child wonder and spark their imagination. This wheeling fun toy is a perfect playmate for your child to race around the house, create stories and pretend play. This easy to grip vehicle will hone your child’s cognitive skills, gross motor skills and spatial awareness. Designed for maximum child safety, this toy is made of natural wood & non-toxic water-based paints which are 100% child safe. The sturdy design of this toy makes it durable enough to keep rolling for generations of play.\nA wonderful addition to your little ones toy collection! Kids will have a rocking good time with this adorable push along miniature vehicle.',549,'14 × 4.4 × 7 cm','18M+','wood'),(25,'PA0701','Push & Pull','Mighty Elephant','Trumpet! Trumpet! Make way for TinyBee’s Mighty Elephant which makes your child’s world full of imagination and creative play! Playing with this toy will bring immense joy to your little ones while making them discover the animal kingdom. \nThis fascinating miniature vehicle features bright colors, attractive patterns and whimsical designs to make your child wonder and spark their imagination. This wheeling fun toy is a perfect playmate for your child to race around the house, create stories and pretend play. This easy to grip vehicle will hone your child’s cognitive skills, gross motor skills and spatial awareness. Designed for maximum child safety, this toy is made of natural wood & non-toxic water-based paints which are 100% child safe. The sturdy design of this toy makes it durable enough to keep rolling for generations of play.\nA wonderful addition to your little ones toy collection! Kids will have a rocking good time with this adorable push along miniature vehicle.',549,'12 × 4.4 × 9.6 cm','18M+','wood'),(26,'PA0801','Push & Pull','Lofty Giraffe','Make way for TinyBee’s Lofty Giraffe which makes your child’s world full of imagination and creative play! Playing with this toy will bring immense joy to your little ones while making them discover the animal kingdom. \nThis fascinating miniature vehicle features bright colors, attractive patterns and whimsical designs to make your child wonder and spark their imagination. This wheeling fun toy is a perfect playmate for your child to race around the house, create stories and pretend play. This easy to grip vehicle will hone your child’s cognitive skills, gross motor skills and spatial awareness. Designed for maximum child safety, this toy is made of natural wood & non-toxic water-based paints which are 100% child safe. The sturdy design of this toy makes it durable enough to keep rolling for generations of play.\nA wonderful addition to your little ones toy collection! Kids will have a rocking good time with this adorable push along miniature vehicle.',549,'10.5 × 4.4 × 12.6 cm','18M+','wood'),(27,'PA0901','Push & Pull','Monster Crocodile','Make way for TinyBee’s Monster Crocodile which makes your child’s world full of imagination and creative play! Playing with this toy will bring immense joy to your little ones while making them discover the animal kingdom. \nThis fascinating miniature vehicle features bright colors, attractive patterns and whimsical designs to make your child wonder and spark their imagination. This wheeling fun toy is a perfect playmate for your child to race around the house, create stories and pretend play. This easy to grip vehicle will hone your child’s cognitive skills, gross motor skills and spatial awareness. Designed for maximum child safety, this toy is made of natural wood & non-toxic water-based paints which are 100% child safe. The sturdy design of this toy makes it durable enough to keep rolling for generations of play.\nA wonderful addition to your little ones toy collection! Kids will have a rocking good time with this adorable push along miniature vehicle.',549,'14 × 4.4 × 9 cm','18M+','wood'),(28,'PA1001','Push & Pull','Hedgehog','Make way for TinyBee’s Hedgehog which makes your child’s world full of imagination and creative play! Playing with this toy will bring immense joy to your little ones while making them discover the animal kingdom. \nThis fascinating miniature vehicle features bright colors, attractive patterns and whimsical designs to make your child wonder and spark their imagination. This wheeling fun toy is a perfect playmate for your child to race around the house, create stories and pretend play. This easy to grip vehicle will hone your child’s cognitive skills, gross motor skills and spatial awareness. Designed for maximum child safety, this toy is made of natural wood & non-toxic water-based paints which are 100% child safe. The sturdy design of this toy makes it durable enough to keep rolling for generations of play.\nA wonderful addition to your little ones toy collection! Kids will have a rocking good time with this adorable push along miniature vehicle.',549,'12 × 4.4 × 8.2 cm','18M+','wood'),(29,'PA1101','Push & Pull','Hungry Caterpillar','Make way for TinyBee’s Hungry Caterpillar which makes your child’s world full of imagination and creative play! Playing with this toy will bring immense joy to your little ones while making them discover the animal kingdom. \nThis fascinating miniature vehicle features bright colors, attractive patterns and whimsical designs to make your child wonder and spark their imagination. This wheeling fun toy is a perfect playmate for your child to race around the house, create stories and pretend play. This easy to grip vehicle will hone your child’s cognitive skills, gross motor skills and spatial awareness. Designed for maximum child safety, this toy is made of natural wood & non-toxic water-based paints which are 100% child safe. The sturdy design of this toy makes it durable enough to keep rolling for generations of play.\nA wonderful addition to your little ones toy collection! Kids will have a rocking good time with this adorable push along miniature vehicle.',549,'14 × 4.4 × 7.8 cm','18M+','wood'),(30,'PA1201','Push & Pull','Quack Quack Duck','Quack! Quack! Make way for TinyBee’s Quack Quack Duck which makes your child’s world full of imagination and creative play! Playing with this toy will bring immense joy to your little ones while making them discover the animal kingdom. \nThis fascinating miniature vehicle features bright colors, attractive patterns and whimsical designs to make your child wonder and spark their imagination. This wheeling fun toy is a perfect playmate for your child to race around the house, create stories and pretend play. This easy to grip vehicle will hone your child’s cognitive skills, gross motor skills and spatial awareness. Designed for maximum child safety, this toy is made of natural wood & non-toxic water-based paints which are 100% child safe. The sturdy design of this toy makes it durable enough to keep rolling for generations of play.\nA wonderful addition to your little ones toy collection! Kids will have a rocking good time with this adorable push along miniature vehicle.',549,'10.6 × 4.4 × 10.6 cm','18M+','wood'),(31,'PA1301','Push & Pull','Hopping Rabbit','Squeak! Squeak! Make way for TinyBee’s Hopping Rabbit which makes your child’s world full of imagination and creative play! Playing with this toy will bring immense joy to your little ones while making them discover the animal kingdom. \nThis fascinating miniature vehicle features bright colors, attractive patterns and whimsical designs to make your child wonder and spark their imagination. This wheeling fun toy is a perfect playmate for your child to race around the house, create stories and pretend play. This easy to grip vehicle will hone your child’s cognitive skills, gross motor skills and spatial awareness. Designed for maximum child safety, this toy is made of natural wood & non-toxic water-based paints which are 100% child safe. The sturdy design of this toy makes it durable enough to keep rolling for generations of play.\nA wonderful addition to your little ones toy collection! Kids will have a rocking good time with this adorable push along miniature vehicle.',549,'12 × 4.4 × 10.4 cm','18M+','wood'),(33,'TEST0101','Motor Skill Development','Wooden Spining Tops','Spin for Fun - Set of 3 colorful spin tops for kids. It\'s an ageless toy, that you too can spin for fun.',500,NULL,NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipment_orders`
--

DROP TABLE IF EXISTS `shipment_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipment_orders` (
  `shipment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `channel_id` varchar(100) DEFAULT NULL,
  `awb_code` varchar(100) DEFAULT NULL,
  `weight` varchar(100) DEFAULT NULL,
  `height` varchar(100) DEFAULT NULL,
  `length` varchar(100) DEFAULT NULL,
  `breadth` varchar(100) DEFAULT NULL,
  `pickup_location` varchar(100) DEFAULT NULL,
  `shiprocket_response` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `shiprocket_request` text,
  PRIMARY KEY (`shipment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipment_orders`
--

LOCK TABLES `shipment_orders` WRITE;
/*!40000 ALTER TABLE `shipment_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipment_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_cart`
--

DROP TABLE IF EXISTS `user_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  PRIMARY KEY (`cart_id`,`user_id`),
  KEY `fk_user_id_idx` (`user_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_cart`
--

LOCK TABLES `user_cart` WRITE;
/*!40000 ALTER TABLE `user_cart` DISABLE KEYS */;
INSERT INTO `user_cart` VALUES (1,2);
/*!40000 ALTER TABLE `user_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_orders`
--

DROP TABLE IF EXISTS `user_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `delivery_address_id` int DEFAULT NULL,
  `payment_receipt_id` varchar(50) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `delivery_date` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `user_fk_idx` (`user_id`),
  KEY `delivery_address_fk_idx` (`delivery_address_id`),
  KEY `receipt_fk_idx` (`payment_receipt_id`),
  CONSTRAINT `delivery_address_fk` FOREIGN KEY (`delivery_address_id`) REFERENCES `delivery_address` (`delivery_address_id`),
  CONSTRAINT `receipt_fk` FOREIGN KEY (`payment_receipt_id`) REFERENCES `payments` (`receipt_id`),
  CONSTRAINT `user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_orders`
--

LOCK TABLES `user_orders` WRITE;
/*!40000 ALTER TABLE `user_orders` DISABLE KEYS */;
INSERT INTO `user_orders` VALUES (1,2,1,'77a38858-6a3c-4742-867b-fd990eaa40e6','received',NULL,'2023-06-23 21:32:54','2023-06-23 21:32:54'),(2,2,2,'daea901f-e861-42e2-9ce0-ae9e77fd84b4','received',NULL,'2023-06-23 21:39:15','2023-06-23 21:39:15'),(3,2,3,'4f516244-5ae9-4054-bc49-cbcbca791e00','received',NULL,'2023-06-23 21:43:43','2023-06-23 21:43:43'),(4,2,6,'c5d54aee-aa95-43f5-bc11-98a80f9978e1','received',NULL,'2023-07-08 17:45:39','2023-07-08 17:45:39'),(5,2,6,'e5537b22-f2f5-42d5-9800-e885a840cb21','received',NULL,'2023-07-08 17:46:07','2023-07-08 17:46:07'),(6,2,6,'8aea4295-7451-439b-b6e3-9b4118ddcebb','received',NULL,'2023-07-08 17:46:18','2023-07-08 17:46:18');
/*!40000 ALTER TABLE `user_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_wishlist`
--

DROP TABLE IF EXISTS `user_wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_wishlist` (
  `wishlist_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  PRIMARY KEY (`wishlist_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_wishlist`
--

LOCK TABLES `user_wishlist` WRITE;
/*!40000 ALTER TABLE `user_wishlist` DISABLE KEYS */;
INSERT INTO `user_wishlist` VALUES (1,2);
/*!40000 ALTER TABLE `user_wishlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstname` varchar(20) DEFAULT NULL,
  `lastname` varchar(20) DEFAULT NULL,
  `role` tinyint NOT NULL,
  PRIMARY KEY (`id`,`email`,`username`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'test@admin.com','admin','$2b$10$akpud8n8YAzsx9acpIe.KuKEW7081.XOteQfe0i5Jl/gknfcB6kwC','Bhavik','Admin',1),(3,'test@user.com','test','$2b$10$akpud8n8YAzsx9acpIe.KuKEW7081.XOteQfe0i5Jl/gknfcB6kwC','Bhavik','User',0),(5,'test@user1.com','user123','$2b$10$mp9lCoIiJ80Oh7Lmh.orcOJYOBJ0uVAqqMxcRiHUMw/rQX5GjYCva','user','123',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification_otp`
--

DROP TABLE IF EXISTS `verification_otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification_otp` (
  `email` varchar(255) NOT NULL,
  `otp` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  FULLTEXT KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification_otp`
--

LOCK TABLES `verification_otp` WRITE;
/*!40000 ALTER TABLE `verification_otp` DISABLE KEYS */;
INSERT INTO `verification_otp` VALUES ('test@admin.com','558926','2023-05-17 22:41:41'),('test@admin.com','594846','2023-05-17 22:42:36'),('test@user1.com','352197','2023-05-17 23:27:45');
/*!40000 ALTER TABLE `verification_otp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist_product`
--

DROP TABLE IF EXISTS `wishlist_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist_product` (
  `wishlist_id` int NOT NULL,
  `product_code` varchar(45) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`wishlist_id`,`product_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='	';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist_product`
--

LOCK TABLES `wishlist_product` WRITE;
/*!40000 ALTER TABLE `wishlist_product` DISABLE KEYS */;
INSERT INTO `wishlist_product` VALUES (1,'TE0200','2023-06-06 22:23:50');
/*!40000 ALTER TABLE `wishlist_product` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-26 22:09:17
