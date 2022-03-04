
function НоменклатураИзменитьКоличество(номенклатура, количество)
{
	let transaction = database.begin();
	transaction.put(номенклатура.Выбор.Покупка, "Количество", количество);
	transaction.commit();
	database.calculate(номенклатура);
	On();
}

function НоменклатураУвеличить()
{
	let ссылка = this.Cell.Bind.split(".")[0];
	let номенклатура = database.find(ссылка);
	let покупка = database.find(номенклатура.Выбор.Покупка);
	НоменклатураИзменитьКоличество(номенклатура, покупка.Количество + 1);
}

function НоменклатураУменьшить()
{
	let ссылка = this.Cell.Bind.split(".")[0];
	let номенклатура = database.find(ссылка);
	let покупка = database.find(номенклатура.Выбор.Покупка);
	НоменклатураИзменитьКоличество(номенклатура, покупка.Количество - 1);
}

function НоменклатураВсе()
{
	let ссылка = this.Cell.Bind.split(".")[0];
	let номенклатура = database.find(ссылка);
	НоменклатураИзменитьКоличество(номенклатура, номенклатура.Остаток);
}

function НоменклатураУдалить()
{
	let ссылка = this.Cell.Bind.split(".")[0];
	let номенклатура = database.find(ссылка);
	let transaction = database.begin();
	transaction.delete(номенклатура.Выбор.Покупка);
	transaction.commit();
	database.calculate(номенклатура);
	On();
}

function ПечатьЭтикетки()
{
	СохранитьКуаркод.call(this);
	On("link", sheet.id, 'reference="Этикетка" type="print" parent="' + this.Cell.Bind.replace(".", "") + '"');
}

function FindChildByClass(parent, className)
{
	if (!parent)
		return null;
	if (!parent.children)
		return null;
	let nodes = parent.children;
	for (let i in nodes)
	{
		let node = nodes[i];
		if (node.className == className)
			return node;
	}
	return null;
}

function СохранитьКуаркод()
{
	// Поиск элемента sheet-qrcode
	for (let bind1 in sheet.Binds)
	{
		if (!bind1.endsWith(".QRCode"))
			continue;

		let node = sheet.Binds[bind1];
		node = FindChildByClass(node, "sheet-flex");
		node = FindChildByClass(node, "sheet-qrcode");
		if (!node)
			break;

		// Поиск на 2 уровне
		let nodes2 = node;
		for (let j in nodes2)
		{
			let node2 = nodes2[j];
			try
			{
				if (node2.tagName.toLowerCase() != "img")
					continue;
			}
			catch (exception)
			{
				continue;
			}

			// Поиск изображения получателя
			for (let bind in sheet.Binds)
			{
				if (!bind.endsWith(".ИзображениеQRCode"))
					continue;
				let cell = sheet.Binds[bind];
				let name = "";
				let base64 = node2.src;
				let start = "data:image/png;base64,";
				if (base64.substr(0, 22) != start)
					return;
				base64 = base64.substr(22);
				let value = "name:" + name + "|" +
							"type:png|" +
							"data:" + base64 + "|";
				cell.SetValue(value, name, null, true);
				break;
			}
		}
	}
}
