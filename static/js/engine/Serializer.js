class Serializer {

    static SerializeToString(items) {
        let serializedItems = [];
        items.forEach(item => serializedItems.push(item.serialize()));

        return JSON.stringify({
            items: serializedItems
        });
    }
}

export default Serializer