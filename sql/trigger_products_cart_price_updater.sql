CREATE DEFINER=`root`@`localhost` TRIGGER `products_cart_price_updater` AFTER UPDATE ON `products` FOR EACH ROW BEGIN
	UPDATE cart SET price=new.price,updated_at=now() WHERE product_code=new.product_code;
END