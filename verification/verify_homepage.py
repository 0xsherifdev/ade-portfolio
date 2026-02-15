from playwright.sync_api import sync_playwright

def verify_homepage():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to homepage...")
            page.goto("http://localhost:3000")

            # Wait for hero to load
            print("Waiting for hero...")
            page.wait_for_selector("h1")

            # Check title
            title = page.title()
            print(f"Page title: {title}")
            assert "Ade | Web3 Developer" in title

            # Check for main sections
            sections = ["about", "skills", "projects", "contact"]
            for section in sections:
                print(f"Checking section: {section}")
                page.locator(f"#{section}").scroll_into_view_if_needed()
                page.wait_for_timeout(500) # Wait for animation
                # Just checking existence for now as visibility depends on viewport and timing
                assert page.locator(f"#{section}").count() > 0

            # Take screenshot of the whole page (or at least a tall viewport)
            print("Taking screenshot...")
            page.set_viewport_size({"width": 1280, "height": 3000})
            page.wait_for_timeout(1000) # Wait for all animations
            page.screenshot(path="verification/homepage.png")
            print("Screenshot saved to verification/homepage.png")

        except Exception as e:
            print(f"Error: {e}")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_homepage()
