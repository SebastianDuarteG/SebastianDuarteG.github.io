CREATE TABLE Users (
	userId		 INTEGER PRIMARY KEY,
	dateCreated	 INTEGER NOT NULL,
	timeCreated  INTEGER NOT NULL,
	userName 	 varchar(50) NOT NULL,
	userEmail 	 varchar(50) NOT NULL UNIQUE,
	userPassword varchar(30) NOT NULL,
	userType	 varchar(10) NOT NULL
);

CREATE TABLE Categories(
	catId	INTEGER PRIMARY KEY,
	catName	varchar(30) NOT NULL UNIQUE,
	catOrder INTEGER NOT NULL
);

CREATE TABLE Products(
	productId	 INTEGER PRIMARY KEY,
	productName  varchar(30) NOT NULL UNIQUE,
	imageUrl	 varchar(100) NOT NULL,
	productPrice INTEGER NOT NULL,
	productDesc	 varchar(200) NOT NULL,
	productDimen varchar(200) NOT NULL,
	productMater varchar(200) NOT NULL,
	catId		 INTEGER NOT NULL,
	productFeat	 INTEGER NOT NULL,
	FOREIGN KEY (catId) REFERENCES Categories(catId)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE Carts(
	cartId	   INTEGER PRIMARY KEY,
	cartStatus INTEGER NOT NULL,
	cartDate   INTEGER NOT NULL,
	userId	   INTEGER NOT NULL,
	FOREIGN KEY (userId) REFERENCES Users(userId)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE CartProducts(
	cartProdId	INTEGER PRIMARY KEY,
	cartId	    INTEGER NOT NULL,
	productId	INTEGER NOT NULL,
	quantity	INTEGER NOT NULL,
	FOREIGN KEY (cartId) REFERENCES Carts(cartId)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	FOREIGN KEY (productId) REFERENCES Products(productId)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);



