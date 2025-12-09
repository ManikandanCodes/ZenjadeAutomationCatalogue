
import os
import re

files_to_update = [
    "Service/system-designing.html",
    "Service/plc-controllers.html",
    "Service/controllers-installation.html",
    "Service/panel-wiring.html",
    "Service/erection-commissioning.html",
    "Service/testing.html",
    "Service/industrial-automation-controllers.html",
    "Service/process-automation.html",
    "Service/drive-troubleshooting.html",
    "Service/plc-scada-interfacing.html",
    "Service/industries.html"
]

new_footer = """<footer class="site-footer">
    <div class="container footer-wrapper">
      <div class="footer-col about-footer">
        <img src="/images/logo.png" alt="Zenjade Logo" class="footer-logo" />
        <p>
          Zenjade Automation Technology Private Limited! We are an Industrial company
          established in 2014, specialized in Industrial automation and Software projects.
        </p>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/index.html"><i class="fa fa-home"></i> Home</a></li>
          <li><a href="/career/career.html"><i class="fa fa-user-tie"></i> Careers</a></li>
          <li><a href="/contact/contact.html"><i class="fa fa-envelope"></i> Contact Us</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Location</h4>
        <p><i class="fa fa-phone"></i> +91 97899 74984</p>
        <p><i class="fa fa-envelope"></i> info@zenjadeautomation.com</p>
        <p><i class="fa fa-envelope"></i> zenjadeautomation@gmail.com</p>
        <p>
          <i class="fa fa-map-marker-alt"></i>
          No.22, 2nd Floor, 7th Street, Balaji Nagar, Nanganallur,<br />
          Chennai, Tamil Nadu, India - 600061
        </p>
      </div>
      <div class="footer-col footer-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d62207.72675946001!2d80.191374!3d12.972944!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525de8b75deb4f%3A0xdfbe513f56294062!2sZenjade%20Automation%20Technology%20Private%20Limited!5e0!3m2!1sen!2sin!4v1764047296270!5m2!1sen!2sin"
          width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
    <div class="footer-social">
      <a href="https://www.facebook.com/people/Zenjade-Automation/61553722506976/" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook"></i></a>
      <a href="https://www.instagram.com/zenjadeautomationtechnology/" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>
      <a href="https://www.linkedin.com/in/zenjade-automation-technology-1347632a1/" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i></a>
      <a href="https://www.youtube.com/@ZENJADEAUTOMATIONTECHNOLOGY" target="_blank" rel="noopener noreferrer"><i class="fab fa-youtube"></i></a>
    </div>
    <div class="footer-bottom">
      © 2025 Zenjade Automation Technology Private Limited.
    </div>
  </footer>"""

base_path = r"c:\Users\msd02\OneDrive\Desktop\Project Folder\Zenjade Website For Catalogue"

for file_rel_path in files_to_update:
    file_path = os.path.join(base_path, file_rel_path)
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to find the footer block
    updated_content = re.sub(r'<footer class="site-footer">.*?</footer>', new_footer, content, flags=re.DOTALL)
    
    if updated_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        print(f"Updated {file_path}")
    else:
        print(f"No footer match found in {file_path}")
