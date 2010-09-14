function(doc)
{
	if(doc.type == "match")
	{
		emit([doc.created_by.toLowerCase(), doc.scheduled_time], null);
		
		doc.players.forEach(function(player)
		{
			if(doc.created_by != player)
				emit([player.toLowerCase(), doc.scheduled_time], null);
		})
	}
}