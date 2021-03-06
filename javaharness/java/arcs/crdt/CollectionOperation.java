package arcs.crdt;

import java.util.Optional;

public class CollectionOperation<T> implements CRDTOperation {
  public enum Type {
    ADD,
    REMOVE
  }

  Type type;
  Optional<T> added;
  Optional<T> removed;
  VersionMap clock;
  String actor;

  public CollectionOperation(Type type, T t, VersionMap clock, String actor) {
    this.type = type;
    switch (type) {
      case ADD:
        this.added = Optional.of(t);
        break;
      case REMOVE:
        this.removed = Optional.of(t);
        break;
    }
    this.clock = clock;
    this.actor = actor;
  }
}
