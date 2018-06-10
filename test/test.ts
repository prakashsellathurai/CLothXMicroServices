
    var doc = this.doc(ref).snapshotChanges().take(1).toPromise();
    return doc.then(function (snap) {
        return snap.payload.exists ? _this.update(ref, data) : _this.set(ref, data);
    });