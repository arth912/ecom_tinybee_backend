CREATE DEFINER=`root`@`localhost` TRIGGER `products_price_archive` AFTER UPDATE ON `products` FOR EACH ROW BEGIN
	INSERT INTO price_update_history(product_code,old_price,new_price,updated_at)
    VALUES (new.product_code,old.price,new.price,NOW());
END