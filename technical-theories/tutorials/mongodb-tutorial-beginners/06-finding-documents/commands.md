# Creating Collections

## MongoDB CLI

### Finding Document

```console
foo@bar:~$ db.collection.find({ obj })
```

#### Limiting Results

```console
foo@bar:~$ db.collection.find({ obj }).limit(int)
```

#### Sorting Records

```console
foo@bar:~$ db.collection.find({ obj }).sort({ obj })
```

#### AND Logic

```console
foo@bar:~$ db.collection.find({ obj, obj })
```

#### OR Logic

```console
foo@bar:~$ db.collection.find({ $or: [{ obj }, { obj }] })
```