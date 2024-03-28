CREATE TABLE Users (
	userId		 varchar(15)	NOT NULL UNIQUE,
	dateCreated	 INT NOT NULL,
	timeCreated  INT NOT NULL,
	userName 	 varchar(50) NOT NULL,
	userEmail 	 varchar(50) NOT NULL UNIQUE,
	userPassword varchar(30) NOT NULL,
	userType	 varchar(10) NOT NULL,
	PRIMARY KEY (userId)
);

CREATE TABLE Categories(
	catId	varchar(15) NOT NULL UNIQUE,
	catName	varchar(30) NOT NULL UNIQUE,
	catOrder INT NOT NULL,
	PRIMARY KEY (catId)
);

CREATE TABLE Products(
	productId	 varchar(25) NOT NULL UNIQUE,
	productName  varchar(30) NOT NULL UNIQUE,
	imageUrl	 varchar(100) NOT NULL,
	productPrice INT NOT NULL,
	productDesc	 varchar(200) NOT NULL,
	productDimen varchar(200) NOT NULL,
	productMater varchar(200) NOT NULL,
	catId		 varchar(15) NOT NULL UNIQUE,
	productFeat	 INT NOT NULL,
	PRIMARY KEY (productId),
	FOREIGN KEY (catId) REFERENCES Categories(catId)
);

CREATE TABLE Carts(
	cartId	   varchar(15) NOT NULL UNIQUE,
	cartStatus INT NOT NULL,
	cartDate   INT NOT NULL,
	userId	   varchar(15) NOT NULL UNIQUE,
	PRIMARY KEY (cartId),
	FOREIGN KEY (userId) REFERENCES Users(userId)
);

CREATE TABLE CartProducts(
	cartProdId	varchar(15) NOT NULL UNIQUE,
	cartId	    varchar(15) NOT NULL UNIQUE,
	productId	varchar(25) NOT NULL UNIQUE,
	quantity	INT NOT NULL,
	PRIMARY KEY (cartProdId),
	FOREIGN KEY (cartId) REFERENCES Carts(cartId),
	FOREIGN KEY (productId) REFERENCES Products(productId)
);



