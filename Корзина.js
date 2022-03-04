
function КорзинаИзменитьКоличество(корзина, строка, количество)
{
	let transaction = database.begin();
	transaction.put(строка.Покупка, "Количество", количество);
	transaction.commit();
	database.calculate(корзина);
	On("modify");
}

function КорзинаУвеличить()
{
	let ссылка = this.Cell.Bind.split(".")[0];
	let строка = database.find(ссылка);
	let корзина = строка.owner;
	let покупка = database.find(строка.Покупка);
	КорзинаИзменитьКоличество(корзина, строка, покупка.Количество + 1);
}

function КорзинаУменьшить()
{
	let ссылка = this.Cell.Bind.split(".")[0];
	let строка = database.find(ссылка);
	let корзина = строка.owner;
	let покупка = database.find(строка.Покупка);
	КорзинаИзменитьКоличество(корзина, строка, покупка.Количество - 1);
}

function КорзинаУдалить()
{
	let ссылка = this.Cell.Bind.split(".")[0];
	let строка = database.find(ссылка);
	let корзина = строка.owner;
	let покупка = database.find(строка.Покупка);
	let transaction = database.begin();
	transaction.delete(покупка);
	transaction.commit();
	database.calculate(корзина);
	On("modify");
}
