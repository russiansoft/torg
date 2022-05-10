
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

function КорзинаОчистить()
{
	let корзина = null;
	for (let image of document.querySelectorAll("img"))
	{
		let cell = image.parentNode.Cell;
		let строка = cell.Bind.split(".")[0];
		корзина = database.find(строка).owner;
	}
	console.log("Корзина: " + корзина);
	let строки = database.select("owner", "owner", корзина);
	if (!строки.length)
		return;
	let transaction = database.begin();
	for (let id of строки)
	{
		let строка = database.find(id);
		let покупка = database.find(строка.Покупка);
		console.log("  " + строка + " -> " + покупка);
		transaction.delete(покупка);
	}
	transaction.commit();
	database.calculate(корзина);
	On("modify");
}

function КорзинаПечатьЭтикеток()
{
	let корзина = null;
	for (let image of document.querySelectorAll("img"))
	{
		let base64 = image.src;
		let start = "data:image/png;base64,";
		if (base64.substr(0, 22) != start)
			continue;
		base64 = base64.substr(22);
		let cell = image.parentNode.Cell;
		console.log(cell.Bind);
		console.log(base64);
		let name = "";
		let value = "name:" + name + "|" +
					"type:png|" +
					"data:" + base64 + "|";
		let строка = cell.Bind.split(".")[0];
		//cell.SetValue(value, name, null, true);
		database.set(строка, "QRCode", value);

		корзина = database.find(строка).owner;
	}
	console.log("Корзина: " + корзина);
	On("link", sheet.id, 'reference="Этикетки" type="print" parent="' + корзина + '"');
}
