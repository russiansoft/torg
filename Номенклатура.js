
function Test1()
{
	// Поиск элемента sheet-qrcode
	let nodes = this.parentNode.children;
	for (let i in nodes)
	{
		let node = nodes[i];
		if (node.className != "sheet-qrcode")
			continue;

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
				if (!bind.endsWith(".ИзображениеКуаркода"))
					continue;
				let cell = sheet.Binds[bind];
				let name = "qrcode.png";
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
