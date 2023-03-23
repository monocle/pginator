import os
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileSystemEvent

logging.basicConfig(level=logging.INFO, format="%(message)s")


class TestWatcher(FileSystemEventHandler):
    """
    This will run `pytest` if there is a change in a target file.
    Target files are:
    1. A file of the form "test_[rest of file name].py
    2. A source file that has a direct corresponding test file. For example,
       if file "src/app/foo.py" was changed and it has a corresponding test file
       "src/tests/test_foo.py", then that test file will be run.
    """

    def run_tests(self, path):
        os.system(f"pytest -s {path}")

    def on_closed(self, event: FileSystemEvent) -> None:
        src_path: str = event.src_path
        dir_path, file_name = os.path.split(src_path)
        base_name, extension = os.path.splitext(file_name)

        if base_name.startswith("test_") and extension == ".py":
            self.run_tests(src_path)
        else:
            target_dir_path = dir_path.replace("app", "tests")
            target_path = os.path.join(target_dir_path, "test_" + file_name)

            if os.path.exists(target_path):
                self.run_tests(target_path)


if __name__ == "__main__":
    event_handler = TestWatcher()
    observer = Observer()

    logging.info("\nWatching for file changes to run tests.")
    observer.schedule(event_handler, "./backend", recursive=True)
    observer.start()

    try:
        while observer.is_alive():
            observer.join(1)
    finally:
        observer.stop()
        observer.join()
