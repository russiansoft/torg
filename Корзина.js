
function КорзинаУвеличить()
{
	let id = this.Cell.Bind.split(".")[0];
	let line = database.find(id);
	database.set(line.id, "Количество", line.Количество + 1);
	On();
}

function КорзинаУменьшить()
{
	let id = this.Cell.Bind.split(".")[0];
	let line = database.find(id);
	database.set(line.id, "Количество", line.Количество - 1);
	On();
}
