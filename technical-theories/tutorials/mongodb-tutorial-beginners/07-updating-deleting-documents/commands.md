# Creating Collections

## MongoDB CLI

### Update & Delete Documents

#### Update One Record

```console
foo@bar:~$ db.collection.updateOne({
    obj
}, $set:{
    newObj
})
```

#### Update Many Records

```console
foo@bar:~$ db.collection.updateMany({
    obj
}, $set:{
    newObj
})
```

#### Replace One Record

```console
foo@bar:~$ db.collection.replaceOne({
    obj
}, {
    newObj
})
```

#### Replace Many Records

```console
foo@bar:~$ db.collection.replaceMany({
    obj
}, {
    newObj
})
```

#### Delete One Record

```console
foo@bar:~$ db.collection.deleteOne({ obj })
```

#### Delete Many Records

```console
foo@bar:~$ db.collection.deleteMany({ obj })
```
